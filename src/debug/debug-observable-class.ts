import { IMapFunction, IObservable, mapObservablePipe } from '@lifaon/rx-js-light';

/**
 * DO NOT USE
 * JUST AN IDEA
 *
 * currently it's a very bad idea, because:
 * - no external / tier pipes
 * - not tree shakable
 * - cannot be mangled
 */

class Observable<GValue> {
  readonly subscribe: IObservable<GValue>;

  constructor(
    subscribe: IObservable<GValue>,
  ) {
    this.subscribe = subscribe;
  }

  map<GOut>(
    mapFunction: IMapFunction<GValue, GOut>,
  ): Observable<GOut> {
    return new Observable<GOut>(mapObservablePipe(mapFunction)(this.subscribe));
  }
}


async function debugObservableClass() {


}
