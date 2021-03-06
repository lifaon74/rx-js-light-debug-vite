import { IMapFunction, ISubscribeFunction, mapSubscribePipe } from '../packages/@lifaon/rx-js-light';

/**
 * DO NOT USE
 * JUST HERE AD AN IDEA
 *
 * currently it's a very bad idea, because:
 * - no external / tier pipes
 * - not tree shakable
 * - cannot be mangled
 */

class Observable<GValue> {
  readonly subscribe: ISubscribeFunction<GValue>;

  constructor(
    subscribe: ISubscribeFunction<GValue>,
  ) {
    this.subscribe = subscribe;
  }

  map<GOut>(
    mapFunction: IMapFunction<GValue, GOut>,
  ): Observable<GOut> {
    return new Observable<GOut>(mapSubscribePipe(mapFunction)(this.subscribe));
  }
}


async function debugObservableClass() {


}
