export function assertNotNull<GValue>(
  value: GValue | null,
): asserts value is GValue {
  if (value === null) {
    throw new Error(`Should not be null`);
  }
}

export function throwIfNull<GValue>(
  value: GValue | null,
): GValue {
  assertNotNull(value);
  return value;
}
