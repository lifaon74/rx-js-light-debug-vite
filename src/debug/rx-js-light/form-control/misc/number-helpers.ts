export function floatEquals(
  a: number,
  b: number,
  precision: number = 1e-6,
): boolean {
  return Math.abs(a - b) < precision;
}

export function isNonNullStepValid(
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
  return (step === 0) || isNonNullStepValid(value, step, stepBase);
}
