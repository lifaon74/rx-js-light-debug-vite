import { createEventListener, IObservable, IObserver, IUnsubscribe } from '@lifaon/rx-js-light';
import { INetworkState } from './types/network-state.type';
import { getNetworkState } from './get-network-state';
import { getNavigatorConnection } from './get-navigator-connection';


export function networkObservable(): IObservable<INetworkState> {
  return (emit: IObserver<INetworkState>): IUnsubscribe => {
    emit(getNetworkState());

    return createEventListener<'change', Event>(getNavigatorConnection(), 'change', (): void => {
      emit(getNetworkState());
    });
  };
}


