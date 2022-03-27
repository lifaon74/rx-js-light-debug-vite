export function createInvalidMimeTypeParameterError(
  message: string,
): Error {
  return new Error(`Invalid mime type parameter: ${message}`);
}
