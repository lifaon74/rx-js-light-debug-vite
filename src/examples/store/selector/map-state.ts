import { ISubscribeFunction, mapSubscribePipe } from '@lifaon/rx-js-light';
import { IStore } from '../store/store.type';
import { ISelector } from './selector.type';

export function mapState<GState, GValue>(
  store: IStore<GState>,
  selector: ISelector<GState, GValue>,
): ISubscribeFunction<GValue> {
  return mapSubscribePipe(selector)(store.subscribe);
}
