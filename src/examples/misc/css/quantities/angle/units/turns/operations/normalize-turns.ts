
export function normalizeTurns(
  value: number,
): number { // [0, 1[
  return ((value % 1) + 1) % 1;
}
