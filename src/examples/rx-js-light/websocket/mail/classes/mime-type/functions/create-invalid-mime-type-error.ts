export function createInvalidMimeTypeError(
  message: string,
): Error {
  return new Error(`Invalid mime type: ${message}`);
}
