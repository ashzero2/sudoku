export function combinations<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  const current: T[] = [];

  const pick = (start: number): void => {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      pick(i + 1);
      current.pop();
    }
  };

  pick(0);
  return result;
}
