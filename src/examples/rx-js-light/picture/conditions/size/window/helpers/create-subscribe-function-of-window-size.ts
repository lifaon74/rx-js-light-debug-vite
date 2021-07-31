import { fromEventTarget, ISubscribeFunction, merge, single} from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { getWindowSize } from './get-window-size';

export function createSubscribeFunctionOfWindowSize(): ISubscribeFunction<ISize> {
  return map$$<Event, ISize>(fromEventTarget(window, 'resize'), getWindowSize);
}

export function createSubscribeFunctionOfWindowSizeInitialized(): ISubscribeFunction<ISize> {
  return merge([
    createSubscribeFunctionOfWindowSize(),
    single(getWindowSize()),
  ]);
}
