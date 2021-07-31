import { combineLatest, ISubscribeFunction } from '@lifaon/rx-js-light';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { IOptionalSource } from '../picture.example';

export function multiMediaSourcesPipe(
  sources: readonly ISubscribeFunction<IOptionalSource>[],
): ISubscribeFunction<IOptionalSource> {
  return map$$<readonly IOptionalSource[], IOptionalSource>(combineLatest(sources), (sources: readonly IOptionalSource[]): IOptionalSource => {
    for (let i = 0, l = sources.length; i < l; i++) {
      if (sources[i] !== void 0) {
        return sources[i];
      }
    }
    return void 0;
  });
}
