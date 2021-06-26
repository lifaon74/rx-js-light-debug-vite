import { IStore } from '../../store/store.type';
import { IActionFunction } from '../action.type';

export interface IDeferredAction<GState, GArguments extends any[]> {
  (store: IStore<GState>): IActionFunction<GArguments>;
}
