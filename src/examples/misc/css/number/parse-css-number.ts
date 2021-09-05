
// https://developer.mozilla.org/en-US/docs/Web/CSS/number

export function parseCSSNumber(
  input: string,
): number | null {
  const value: number = Number(input);
  return ((input.trim() === '') || Number.isNaN(value) || !Number.isFinite(value))
    ? null
    : value;
}
