import {
  fromPromise, IMapFilterDiscard, ISubscribeFunction, ISubscribeFunctionFromPromiseNotifications,
  ISubscribePipeFunction,
  MAP_FILTER_DISCARD, single
} from '@lifaon/rx-js-light';
import { map$$, mapFilter$$, mergeMapS$$$ } from '@lifaon/rx-js-light-shortcuts';
import { multiMediaSourcesPipe } from './source/multi-media-sources-pipe';
import { mediaSourcePipe } from './source/media-source-pipe';
import { maxSizeElement } from './conditions/size/element/max-size-element';
import { awaitImageLoaded, createImage, sourceToDataURL } from '../../misc/image/image-helpers';
import { mediaSource } from './source/media-source';

export type IOptionalSource = string | undefined;


function isWindow(
  value: any,
): value is Window {
  return (value instanceof Window);
}


/** SOURCE **/


function sourceLoadAndCache(
  subscribe: ISubscribeFunction<IOptionalSource>,
): ISubscribeFunction<IOptionalSource> {
  return sourceLoadAndCachePipe()(subscribe);
}

const SOURCE_LOAD_AND_CACHE_PIPE_CACHE = new Map<string, ISubscribeFunction<IOptionalSource>>();

function sourceLoadAndCachePipe(): ISubscribePipeFunction<IOptionalSource, IOptionalSource> {
  return mergeMapS$$$<IOptionalSource, IOptionalSource>((src: IOptionalSource): ISubscribeFunction<IOptionalSource> => {
    if (src === void 0) {
      return single(void 0);
    } else {
      let cached: ISubscribeFunction<IOptionalSource> | undefined = SOURCE_LOAD_AND_CACHE_PIPE_CACHE.get(src);
      if (cached === void 0) {
        cached = mapFilter$$(fromPromise(sourceToDataURL(src)), (notification: ISubscribeFunctionFromPromiseNotifications<string>): IOptionalSource | IMapFilterDiscard => {
          switch (notification.name) {
            case 'error':
              return void 0;
            case 'next':
              return notification.value;
            case 'complete':
              return MAP_FILTER_DISCARD;
          }
        });
        SOURCE_LOAD_AND_CACHE_PIPE_CACHE.set(src, cached);
      }
      return cached as ISubscribeFunction<IOptionalSource>;
    }
  });
}






/*---------------------*/

function samplePicture$$(
  element: Element,
): ISubscribeFunction<IOptionalSource> {
  const root: string = '/assets/images/dynamic';

  const source100$ = mediaSourcePipe(`${ root }/sample-100.jpg`, [maxSizeElement(element, { width: 100, height: 67 })]);
  const source500$ = mediaSourcePipe(`${ root }/sample-500.jpg`, [maxSizeElement(element, { width: 500, height: 336 })]);
  const source1000$ = mediaSourcePipe(`${ root }/sample-1000.jpg`, [maxSizeElement(element, { width: 1000, height: 671 })]);
  const source2000$ = mediaSourcePipe(`${ root }/sample-2000.jpg`, [maxSizeElement(element, { width: 2000, height: 1342 })]);
  const sourceNative$ = mediaSource(`${ root }/sample-native.jpg`);

  return multiMediaSourcesPipe([
    source100$,
    source500$,
    source1000$,
    source2000$,
    sourceNative$,
  ].map(sourceLoadAndCache));
}


/*---------------------*/

export function pictureExample() {
  // const root: string = '/assets/images/dynamic';

  // const picture$ = pipe$$(source(`${ root }/sample-100.jpg`), []);
  // const source100$ = mediaSourcePipe(`${ root }/sample-100.jpg`, [maxWidthWindow(100)]);
  // const source500$ = mediaSourcePipe(`${ root }/sample-500.jpg`, [maxWidthWindow(500)]);
  // const source2000$ = mediaSourcePipe(`${ root }/sample-2000.jpg`, [maxWidthWindow(2000)]);
  // const sourceNative$ = mediaSourcePipe(`${ root }/sample-native.jpg`, []);
  // const picture$ = multiMediaSourcesPipe([
  //   source100$,
  //   source500$,
  //   source2000$,
  //   sourceNative$,
  // ]);


  const container = document.createElement('div');

  const picture$ = samplePicture$$(container);

  document.body.appendChild(container);

  // container.style.setProperty('width', '500px');
  // container.style.setProperty('height', '500px');

  container.style.setProperty('width', '100%');
  // container.style.setProperty('height', '100%');
  container.style.setProperty('aspect-ratio', '3670 / 2462');

  container.style.setProperty('background-repeat', 'no-repeat');
  container.style.setProperty('background-position', 'center center');
  container.style.setProperty('background-size', 'contain');

  picture$((src: IOptionalSource) => {
    console.log('change');
    if (src === void 0) {
      container.style.removeProperty('background-image');
    } else {
      container.style.setProperty('background-image', `url(${ src })`);
    }
  });
}
