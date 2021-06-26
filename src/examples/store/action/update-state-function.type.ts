export interface IUpdateStateFunction<GState, GArguments extends any[]> {
  (state: GState, ...args: GArguments): GState,
}
