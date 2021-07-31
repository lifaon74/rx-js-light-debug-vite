export function createTypeError(
  variableName: string,
  message: string,
): TypeError {
  return new TypeError(`for ${ variableName }: ${ message }`);
}
