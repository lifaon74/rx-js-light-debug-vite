import { createEventListener, IObservable, IObserver, IUnsubscribe } from '@lifaon/rx-js-light';
import { IScreenOrientation } from './types/screen-orientation.type';
import { getMappedScreenOrientation } from './get-mapped-screen-orientation';
import { getScreenOrientation } from './get-screen-orientation';

export function screenOrientationObservable(): IObservable<IScreenOrientation> {
  return (emit: IObserver<IScreenOrientation>): IUnsubscribe => {
    emit(getMappedScreenOrientation());

    return createEventListener<'change', Event>(getScreenOrientation(), 'change', (): void => {
      emit(getMappedScreenOrientation());
    });
  };
}
