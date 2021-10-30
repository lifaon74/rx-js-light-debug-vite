
export function isSet<GValue>(
  value: any,
): value is Set<GValue> {
  return value instanceof Set;
}
