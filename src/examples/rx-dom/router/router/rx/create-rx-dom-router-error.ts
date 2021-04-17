
export function createRXDomRouterError(
  id: number,
  message: string,
): Error {
  return new Error(`rx-dom-router-err-${ id } - ${ message }`)
}
