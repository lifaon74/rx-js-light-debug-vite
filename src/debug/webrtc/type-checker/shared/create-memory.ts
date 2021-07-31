
export type IMemory = WeakSet<any>;

export function createMemory(): IMemory {
  return new WeakSet<any>();
}
