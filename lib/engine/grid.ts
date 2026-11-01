export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
export const ALL_DIGITS = (1 << BOARD_SIZE) - 1;
export const DIGITS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function rowOf(cell: number): number {
  return Math.floor(cell / BOARD_SIZE);
}

export function colOf(cell: number): number {
  return cell % BOARD_SIZE;
}

export function boxOf(cell: number): number {
  return Math.floor(rowOf(cell) / BOX_SIZE) * BOX_SIZE + Math.floor(colOf(cell) / BOX_SIZE);
}

function buildUnits(): number[][] {
  const rows: number[][] = [];
  const cols: number[][] = [];
  const boxes: number[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    rows.push([]);
    cols.push([]);
    boxes.push([]);
  }

  for (let cell = 0; cell < CELL_COUNT; cell++) {
    rows[rowOf(cell)].push(cell);
    cols[colOf(cell)].push(cell);
    boxes[boxOf(cell)].push(cell);
  }

  return [...rows, ...cols, ...boxes];
}

function buildPeers(units: readonly (readonly number[])[]): number[][] {
  const peers = Array.from({ length: CELL_COUNT }, () => new Set<number>());
  for (const unit of units) {
    for (const a of unit) {
      for (const b of unit) {
        if (a !== b) peers[a].add(b);
      }
    }
  }
  return peers.map((set) => [...set]);
}

function buildSeesTable(peers: readonly (readonly number[])[]): Uint8Array {
  const table = new Uint8Array(CELL_COUNT * CELL_COUNT);
  peers.forEach((cellPeers, cell) => {
    for (const peer of cellPeers) table[cell * CELL_COUNT + peer] = 1;
  });
  return table;
}

function buildPopCounts(): Uint8Array {
  const table = new Uint8Array(ALL_DIGITS + 1);
  for (let mask = 1; mask <= ALL_DIGITS; mask++) {
    table[mask] = table[mask >> 1] + (mask & 1);
  }
  return table;
}

/** The 27 units: 9 rows, then 9 columns, then 9 boxes, each as cell indices. */
export const UNITS: readonly (readonly number[])[] = buildUnits();

export const ROWS = UNITS.slice(0, BOARD_SIZE);
export const COLS = UNITS.slice(BOARD_SIZE, 2 * BOARD_SIZE);
export const BOXES = UNITS.slice(2 * BOARD_SIZE);

export const PEERS: readonly (readonly number[])[] = buildPeers(UNITS);

const SEES = buildSeesTable(PEERS);
const POP_COUNTS = buildPopCounts();

export function sees(a: number, b: number): boolean {
  return SEES[a * CELL_COUNT + b] === 1;
}

/** Cells, other than those given, that see every one of the given cells. */
export function commonPeers(cells: readonly number[]): number[] {
  const result: number[] = [];
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (!cells.includes(cell) && cells.every((other) => sees(other, cell))) result.push(cell);
  }
  return result;
}

export function digitBit(digit: number): number {
  return 1 << (digit - 1);
}

export function bitDigit(bit: number): number {
  return 32 - Math.clz32(bit);
}

export function popCount(mask: number): number {
  return POP_COUNTS[mask];
}

export function isSingle(mask: number): boolean {
  return mask !== 0 && (mask & (mask - 1)) === 0;
}
