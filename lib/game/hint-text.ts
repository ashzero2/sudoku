import { DIGITS, digitBit } from '@/lib/engine/grid';
import type { Technique } from '@/lib/engine/types';
import type { HintState } from '@/lib/game/hints';

export const TECHNIQUE_NAMES: Record<Technique, string> = {
  'full-house': 'Full house',
  'hidden-single': 'Hidden single',
  'naked-single': 'Naked single',
  pointing: 'Pointing',
  claiming: 'Claiming',
  'naked-pair': 'Naked pair',
  'x-wing': 'X-Wing',
  'hidden-pair': 'Hidden pair',
  'naked-triple': 'Naked triple',
  swordfish: 'Swordfish',
  'hidden-triple': 'Hidden triple',
  skyscraper: 'Skyscraper',
  'two-string-kite': '2-String Kite',
  'turbot-fish': 'Turbot fish',
  'xy-wing': 'XY-Wing',
  'xyz-wing': 'XYZ-Wing',
};

const LINKED_ENDS = (digit: string) =>
  `Two pairs of ${digit} are linked, so one of the end cells must hold it. ${digit} can be removed from cells that see both ends.`;

// What the technique says, given the digit or digits it involves.
const EXPLANATIONS: Record<Technique, (digits: string) => string> = {
  'full-house': () => 'Only one cell is left empty here, so it takes the missing digit.',
  'hidden-single': (d) => `In this house, ${d} can only go in the highlighted cell.`,
  'naked-single': (d) => `Only ${d} is still possible in the highlighted cell.`,
  pointing: (d) =>
    `In this box, ${d} can only go along one line, so it can be removed from the rest of that line.`,
  claiming: (d) =>
    `In this line, ${d} can only go in one box, so it can be removed from the rest of that box.`,
  'naked-pair': (d) =>
    `The highlighted cells can only hold ${d} between them, so those digits can be removed from the other cells in their house.`,
  'naked-triple': (d) =>
    `The highlighted cells can only hold ${d} between them, so those digits can be removed from the other cells in their house.`,
  'hidden-pair': (d) =>
    `${d} can only go in the highlighted cells, so every other digit can be removed from them.`,
  'hidden-triple': (d) =>
    `${d} can only go in the highlighted cells, so every other digit can be removed from them.`,
  'x-wing': (d) =>
    `${d} is confined to the same two lines in two rows or columns, so it can be removed elsewhere in those lines.`,
  swordfish: (d) =>
    `${d} is confined to the same three lines in three rows or columns, so it can be removed elsewhere in those lines.`,
  skyscraper: LINKED_ENDS,
  'two-string-kite': LINKED_ENDS,
  'turbot-fish': LINKED_ENDS,
  'xy-wing': (d) =>
    `Whichever digit the middle cell takes, ${d} ends up in one of the outer cells, so ${d} can be removed from cells that see both.`,
  'xyz-wing': (d) =>
    `Whichever digit the middle cell takes, ${d} ends up in one of the outer cells, so ${d} can be removed from cells that see all three.`,
};

function digitList(mask: number): string {
  return DIGITS.filter((digit) => (mask & digitBit(digit)) !== 0).join(', ');
}

export function hintMessage(hint: HintState): string {
  if (hint.kind === 'mistake') return 'One of your entries is wrong. It is highlighted.';

  if (hint.kind === 'fallback') {
    return hint.tier === 1
      ? 'Look at the highlighted cell. Tap Hint again for more.'
      : 'This one needs an advanced technique with no short explanation. Tap Hint again to fill in the digit.';
  }

  if (hint.tier === 1) {
    return 'Look at the highlighted cells. Tap Hint again to see the technique.';
  }
  const [step] = hint.steps;
  return `${TECHNIQUE_NAMES[step.technique]}. ${EXPLANATIONS[step.technique](digitList(step.digits))} Tap Hint again to fill in the digit.`;
}
