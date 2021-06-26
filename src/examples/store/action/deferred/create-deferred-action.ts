import { IStore } from '../../store/store.type';
import { IActionFunction } from '../action.type';
import { createAction } from '../create-action';
import { IDeferredAction } from './deferred-action.type';
import { IUpdateStateFunction } from '../update-state-function.type';

export function createDeferredAction<GState, GArguments extends any[]>(
  updateState: IUpdateStateFunction<GState, GArguments>,
): IDeferredAction<GState, GArguments> {
  return (store: IStore<GState>): IActionFunction<GArguments> => {
    return createAction<GState, GArguments>(store, updateState);
  };
}
