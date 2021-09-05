
export interface IParser<GReturn> {
  (input: string): GReturn | null;
}

export function resolveMultipleParsers<GReturn>(
  input: string,
  parsers: IParser<GReturn>[],
): GReturn | null {
  for (let i = 0, l = parsers.length; i < l; i++) {
    const value: GReturn | null = parsers[i](input);
    if (value !== null) {
      return value;
    }
  }
  return null;
}
