import {
  fromPromise, IMapFilterDiscard, IObservable, IFromPromiseObservableNotifications, IObservablePipe, MAP_FILTER_DISCARD,
  mapFilter$$, mergeMapS$$, mergeMapS$$$, not$$, single
} from '@lifaon/rx-js-light';
import { selectFirstValidMediaSource } from './source/select-first-valid-media-source';
import { mediaSourceWithConditions } from './source/media-source-with-conditions';
import { maxSizeElement } from './conditions/size/element/max-size-element';
import { sourceToDataURL } from '../../misc/media/image/image-helpers';
import { mediaSource } from './source/media-source';
import { IOptionalSource } from './source/optional-source.type';
import { createElementSizeObservableInitialized } from './conditions/size/element/helpers/create-element-size-observable';
import { elementInvisible, elementVisible } from './conditions/size/element/element-visible';


function isWindow(
  value: any,
): value is Window {
  return (value instanceof Window);
}


/** SOURCE **/

const SOURCE_LOAD_AND_CACHE_CACHE = new Map<string, IObservable<IOptionalSource>>();

function sourceLoadAndCache(
  subscribe: IObservable<IOptionalSource>,
): IObservable<IOptionalSource> {
  return mergeMapS$$<IOptionalSource, IOptionalSource>(subscribe, (src: IOptionalSource): IObservable<IOptionalSource> => {
    if (src === void 0) {
      return single(void 0);
    } else {
      if (src.startsWith('data:')) {
        return single(src);
      } else {
        let cached: IObservable<IOptionalSource> | undefined = SOURCE_LOAD_AND_CACHE_CACHE.get(src);
        if (cached === void 0) {
          cached = mapFilter$$(fromPromise(sourceToDataURL(src)), (notification: IFromPromiseObservableNotifications<string>): IOptionalSource | IMapFilterDiscard => {
            switch (notification.name) {
              case 'error':
                return void 0;
              case 'next':
                return notification.value;
              case 'complete':
                return MAP_FILTER_DISCARD;
            }
          });
          SOURCE_LOAD_AND_CACHE_CACHE.set(src, cached as IObservable<IOptionalSource>);
        }
        return cached as IObservable<IOptionalSource>;
      }
    }
  });
}



export function mediaSourceForInvisibleElement(
  element: Element,
): IObservable<IOptionalSource> {
  return mediaSourceWithConditions('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', [elementInvisible(element)]);
}

/*---------------------*/

function samplePicture$$(
  element: Element,
): IObservable<IOptionalSource> {
  const root: string = '/assets/images/dynamic';

  const source0 = mediaSourceForInvisibleElement(element);
  const source100$ = mediaSourceWithConditions(`${ root }/sample-100.jpg`, [maxSizeElement(element, { width: 100, height: 67 })]);
  const source500$ = mediaSourceWithConditions(`${ root }/sample-500.jpg`, [maxSizeElement(element, { width: 500, height: 336 })]);
  const source1000$ = mediaSourceWithConditions(`${ root }/sample-1000.jpg`, [maxSizeElement(element, { width: 1000, height: 671 })]);
  const source2000$ = mediaSourceWithConditions(`${ root }/sample-2000.jpg`, [maxSizeElement(element, { width: 2000, height: 1342 })]);
  const sourceNative$ = mediaSource(`${ root }/sample-native.jpg`);

  return sourceLoadAndCache(selectFirstValidMediaSource([
    source0,
    source100$,
    source500$,
    source1000$,
    source2000$,
    sourceNative$,
  ]));
}


/*---------------------*/

export function pictureExample() {
  // const root: string = '/assets/images/dynamic';

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
    // console.log('change', src);
    if (src === void 0) {
      container.style.removeProperty('background-image');
    } else {
      container.style.setProperty('background-image', `url(${ src })`);
    }
  });
}
