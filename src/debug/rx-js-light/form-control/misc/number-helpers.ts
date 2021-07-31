export function floatEquals(
  a: number,
  b: number,
  precision: number = 1e-6,
): boolean {
  return Math.abs(a - b) < precision;
}

/*
  y = stepBase + step * x
  x = (y - stepBase) / step
  => x must be an integer
*/

export function isNonZeroStepValid(
  value: number,
  step: number,
  stepBase: number,
): boolean {
  const a: number = (value - stepBase) / step;
  return floatEquals(a, Math.round(a));
}

export function isStepValid(
  value: number,
  step: number,
  stepBase: number,
): boolean {
  return (step === 0) || isNonZeroStepValid(value, step, stepBase);
}
