export function propertyKeyToPropertyName(
  propertyKey: PropertyKey,
): string {
  return (typeof propertyKey === 'symbol')
    ? propertyKey.toString()
    : JSON.stringify(propertyKey);
}
