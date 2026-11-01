import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { createRng, type Rng } from '@/lib/engine/rng';
import { countSolutions } from '@/lib/engine/solver';
import type { Difficulty } from '@/lib/engine/types';

const SOURCE_COMMIT = 'd8c8ebaee0c08c412cfba96af1923dfa61c83317';
const SOURCE_URL = `https://raw.githubusercontent.com/grantm/sudoku-exchange-puzzle-bank/${SOURCE_COMMIT}`;
const SOURCE_FILES = ['easy', 'medium', 'hard', 'diabolical'];
const CACHE_DIR = 'build/bank-source';
const OUTPUT_DIR = 'assets/bank';
const PUZZLES_PER_LEVEL = 5000;
const SEED = 1;

// Each level takes the Sukaku Explainer ratings from the previous level's limit up to `below`.
const LEVELS: { difficulty: Difficulty; below: number }[] = [
  { difficulty: 'very-easy', below: 1.5 },
  { difficulty: 'easy', below: 2.0 },
  { difficulty: 'medium', below: 2.7 },
  { difficulty: 'hard', below: 4.5 },
  { difficulty: 'expert', below: 7.1 },
  { difficulty: 'extreme', below: Infinity },
];

const LINE_PATTERN = /^([0-9a-f]{12}) +([0-9]{81}) +(\d+\.\d)$/;

interface SourcePuzzle {
  id: string;
  puzzle: string;
  se: number;
}

async function readSource(name: string): Promise<string> {
  const path = `${CACHE_DIR}/${name}.txt`;
  if (!existsSync(path)) {
    const response = await fetch(`${SOURCE_URL}/${name}.txt`);
    if (!response.ok) throw new Error(`Download of ${name}.txt failed: ${response.status}`);
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(path, await response.text());
  }
  return readFile(path, 'utf8');
}

function parsePuzzles(text: string, seen: Set<string>): SourcePuzzle[] {
  const puzzles: SourcePuzzle[] = [];
  for (const line of text.split('\n')) {
    const match = LINE_PATTERN.exec(line);
    if (!match || seen.has(match[2])) continue;
    seen.add(match[2]);
    puzzles.push({ id: match[1], puzzle: match[2], se: Number(match[3]) });
  }
  return puzzles;
}

function shuffle<T>(items: T[], rng: Rng): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function allocate(sizes: readonly number[], total: number): number[] {
  const quotas = sizes.map(() => 0);
  let remaining = Math.min(
    total,
    sizes.reduce((sum, size) => sum + size, 0),
  );

  while (remaining > 0) {
    const open = sizes.map((_, i) => i).filter((i) => quotas[i] < sizes[i]);
    const share = Math.max(1, Math.floor(remaining / open.length));
    for (const i of open) {
      const grant = Math.min(share, sizes[i] - quotas[i], remaining);
      quotas[i] += grant;
      remaining -= grant;
      if (remaining === 0) break;
    }
  }
  return quotas;
}

function isUnique(puzzle: string): boolean {
  return countSolutions([...puzzle].map(Number), 2) === 1;
}

function sampleLevel(
  puzzles: SourcePuzzle[],
  rng: Rng,
): { rows: [string, string, number][]; rejected: number; ratings: number } {
  const byRating = new Map<number, SourcePuzzle[]>();
  for (const puzzle of puzzles) {
    const bucket = byRating.get(puzzle.se);
    if (bucket) bucket.push(puzzle);
    else byRating.set(puzzle.se, [puzzle]);
  }

  const ratings = [...byRating.keys()].sort((a, b) => a - b);
  const quotas = allocate(
    ratings.map((se) => byRating.get(se)!.length),
    PUZZLES_PER_LEVEL,
  );

  const rows: [string, string, number][] = [];
  let rejected = 0;
  ratings.forEach((se, index) => {
    const pool = byRating.get(se)!;
    shuffle(pool, rng);
    let taken = 0;
    for (const { id, puzzle } of pool) {
      if (taken === quotas[index]) break;
      if (!isUnique(puzzle)) {
        rejected++;
        continue;
      }
      rows.push([id, puzzle, se]);
      taken++;
    }
  });

  return { rows, rejected, ratings: ratings.length };
}

async function main(): Promise<void> {
  const seen = new Set<string>();
  const source: SourcePuzzle[] = [];
  for (const name of SOURCE_FILES) {
    for (const puzzle of parsePuzzles(await readSource(name), seen)) source.push(puzzle);
  }
  console.log(`Source: ${source.length} unique puzzles at ${SOURCE_COMMIT.slice(0, 7)}`);

  const rng = createRng(SEED);
  await mkdir(OUTPUT_DIR, { recursive: true });

  let totalBytes = 0;
  let lower = 0;
  for (const { difficulty, below } of LEVELS) {
    const inLevel = source.filter((puzzle) => puzzle.se >= lower && puzzle.se < below);
    lower = below;

    const { rows, rejected, ratings } = sampleLevel(inLevel, rng);
    const json = JSON.stringify(rows);
    await writeFile(`${OUTPUT_DIR}/${difficulty}.json`, json);

    totalBytes += json.length;
    const range = `${rows[0][2]}-${rows[rows.length - 1][2]}`;
    console.log(
      `${difficulty.padEnd(10)} ${String(rows.length).padStart(5)} of ${String(inLevel.length).padStart(6)}` +
        `  ratings ${String(ratings).padStart(2)} (${range})  rejected ${rejected}  ${(json.length / 1024).toFixed(0)} KB`,
    );
    if (rows.length < PUZZLES_PER_LEVEL) process.exitCode = 1;
  }
  console.log(`Total ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
