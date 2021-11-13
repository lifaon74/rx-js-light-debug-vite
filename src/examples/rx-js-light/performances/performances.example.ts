import { from as fromRXJS } from 'rxjs';
import { distinct$$$, fromArray, map$$$, pipe$$, filter$$$ } from '@lifaon/rx-js-light';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

// https://blog.asayer.io/hyperapp-is-it-the-lightweight-react-killer

function rxJSLightPerformancesExample1() {
  const values = Array.from({ length: 1e5 }, (v: any, index: number) => index);

  const withRXJS = () => {

    let j = 0;

    const obs = fromRXJS(values)
      .pipe(
        map((value: number) => value * 2),
        filter((value: number) => value > 1e4),
        distinctUntilChanged(),
      );

    console.time('start');
    for (let i = 0; i < 1e2; i++) {
      obs.subscribe((value: number) => {
        j += value;
      });
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  const withRXJSLight = () => {

    let j = 0;

    const subscribe = pipe$$(fromArray(values), [
      map$$$<number, number>((value: number) => value * 2),
      filter$$$<number>((value: number) => value > 1e4),
      distinct$$$<number>(),
    ]);

    console.time('start');
    for (let i = 0; i < 1e2; i++) {
      subscribe((value: number) => {
        j += value;
      });
    }
    console.timeEnd('start');
    console.log('j', j);
  };

  /* RxJS */

  withRXJS();

  // speed:
  //  1259.89697265625 ms

  // size:
  //  dist/assets/index.df218447.js    0.89kb / brotli: 0.46kb
  //  dist/assets/vendor.85359b5f.js   12.29kb / brotli: 3.40kb
  //  total: 13.18kb / 3.86kb


  /* rx-js-light */

  // withRXJSLight();

  // speed:
  //  388.719970703125 ms
  //  => 3.2x faster

  // size:
  //  dist/assets/index.f4437db2.js    1.09kb / brotli: 0.52kb
  //  => 12.1x / 6.53x smaller
}

/*-------------*/

export function rxJSLightPerformancesExample() {
  rxJSLightPerformancesExample1();
}
