
export function throwUnknownUnitError(
  unit: string,
): never {
  throw new Error(`Unknown unit: ${ unit }`);
}
