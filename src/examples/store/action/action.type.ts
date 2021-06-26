
export interface IActionFunction<GArguments extends any[]> {
  (...args: GArguments): void,
}
