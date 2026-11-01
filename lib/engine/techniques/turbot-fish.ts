import {
  BOARD_SIZE,
  DIGITS,
  UNITS,
  boxOf,
  colOf,
  commonPeers,
  digitBit,
  rowOf,
  sees,
} from '@/lib/engine/grid';
import { cellsWithDigit } from '@/lib/engine/grid-state';
import type { GridState, Step, Technique } from '@/lib/engine/types';
import { eliminationStep, eliminationsFor } from '@/lib/engine/techniques/elimination';

type UnitKind = 'row' | 'col' | 'box';

interface StrongLink {
  kind: UnitKind;
  ends: [number, number];
}

function unitKind(unitIndex: number): UnitKind {
  if (unitIndex < BOARD_SIZE) return 'row';
  return unitIndex < 2 * BOARD_SIZE ? 'col' : 'box';
}

function strongLinks(state: GridState, bit: number): StrongLink[] {
  const links: StrongLink[] = [];
  UNITS.forEach((unit, unitIndex) => {
    const cells = cellsWithDigit(state, unit, bit);
    if (cells.length === 2) links.push({ kind: unitKind(unitIndex), ends: [cells[0], cells[1]] });
  });
  return links;
}

function classify(first: StrongLink, second: StrongLink, joinA: number, joinB: number): Technique {
  if (first.kind === 'row' && second.kind === 'row' && colOf(joinA) === colOf(joinB)) {
    return 'skyscraper';
  }
  if (first.kind === 'col' && second.kind === 'col' && rowOf(joinA) === rowOf(joinB)) {
    return 'skyscraper';
  }
  const rowAndCol =
    (first.kind === 'row' && second.kind === 'col') ||
    (first.kind === 'col' && second.kind === 'row');
  if (rowAndCol && boxOf(joinA) === boxOf(joinB)) return 'two-string-kite';
  return 'turbot-fish';
}

export function findTurbotFish(state: GridState): Step | null {
  for (const digit of DIGITS) {
    const bit = digitBit(digit);
    const links = strongLinks(state, bit);

    for (const first of links) {
      for (const second of links) {
        if (first === second) continue;

        for (const [startA, joinA] of [first.ends, [first.ends[1], first.ends[0]]]) {
          for (const [joinB, endB] of [second.ends, [second.ends[1], second.ends[0]]]) {
            const distinct = new Set([startA, joinA, joinB, endB]).size === 4;
            if (!distinct || !sees(joinA, joinB)) continue;

            const step = eliminationStep(
              classify(first, second, joinA, joinB),
              [startA, joinA, joinB, endB],
              bit,
              eliminationsFor(state, commonPeers([startA, endB]), bit),
            );
            if (step) return step;
          }
        }
      }
    }
  }
  return null;
}
