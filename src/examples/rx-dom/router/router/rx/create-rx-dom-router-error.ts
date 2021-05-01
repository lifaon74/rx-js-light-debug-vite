
export function createRXDOMRouterError(
  id: number,
  message: string,
): Error {
  return new Error(`rx-dom-router-err-${ id } - ${ message }`)
}
