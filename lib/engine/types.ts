export const DIFFICULTIES = ['very-easy', 'easy', 'medium', 'hard', 'expert', 'extreme'] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export type Board = number[];

export type Notes = number[];

export interface BankPuzzle {
  id: string;
  puzzle: string;
  se: number;
}

export type Technique =
  | 'full-house'
  | 'hidden-single'
  | 'naked-single'
  | 'pointing'
  | 'claiming'
  | 'naked-pair'
  | 'x-wing'
  | 'hidden-pair'
  | 'naked-triple'
  | 'swordfish'
  | 'hidden-triple'
  | 'skyscraper'
  | 'two-string-kite'
  | 'turbot-fish'
  | 'xy-wing'
  | 'xyz-wing';

export interface Placement {
  cell: number;
  digit: number;
}

export interface Elimination {
  cell: number;
  digits: number;
}

export interface Step {
  technique: Technique;
  cells: number[];
  digits: number;
  placement: Placement | null;
  eliminations: Elimination[];
}

export interface GridState {
  values: Board;
  candidates: Uint16Array;
}

export type Finder = (state: GridState) => Step | null;
