export function throwNotEnoughSpaceError(): never {
  throw createNotEnoughSpaceError();
}

export function createNotEnoughSpaceError(): Error {
  return new Error(`Not enough space`);
}
