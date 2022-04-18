import { combineLatest, debounceTime$$$, IObservable, map$$$, pipe$$ } from '@lirx/core';
import { IOptionalSource } from './optional-source.type';

export function selectFirstValidMediaSource(
  sources: readonly IObservable<IOptionalSource>[],
): IObservable<IOptionalSource> {
  return pipe$$(combineLatest<readonly IObservable<IOptionalSource>[]>(sources), [
    map$$$<readonly IOptionalSource[], IOptionalSource>((sources: readonly IOptionalSource[]): IOptionalSource => {
      for (let i = 0, l = sources.length; i < l; i++) {
        if (sources[i] !== void 0) {
          return sources[i];
        }
      }
      return void 0;
    }),
    debounceTime$$$<IOptionalSource>(0),
  ]);
}
