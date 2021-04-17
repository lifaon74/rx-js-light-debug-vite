import {
  createEventListener, createMulticastSource, createNotification, freeze, INotification, ISubscribeFunction
} from '@lifaon/rx-js-light';
import { patchObjectMethod } from '@lifaon/rx-dom';
import { getLocation } from './get-location';
import { getHistory } from './get-history';
import { getBaseURI } from './get-base-uri';


export interface INavigationState {
  readonly url: URL;
}

export function createNavigationState(
  url: URL,
): INavigationState {
  return freeze({
    url,
  });
}

export function historyStateEquals(
  a: INavigationState,
  b: INavigationState,
): boolean {
  return (a.url.toString() === b.url.toString());
}


/*---*/


export type INavigationEvent =
  'push'
  | 'back'
  | 'forward'
  | 'refresh'
  | 'replace'
  ;

export type INavigationNotification = INotification<INavigationEvent, INavigationState>;

export interface INavigation {
  readonly onChange: ISubscribeFunction<INavigationNotification>;
  readonly getState: (index?: number) => (INavigationState | null);
  readonly navigate: (url: URL | string, replaceState?: boolean) => void;
  readonly back: () => void;
  readonly canBack: () => boolean;
  readonly forward: () => void;
  readonly canForward: () => boolean;
  readonly reset: () => void;
}

export function createNavigation(
  limit: number = Number.POSITIVE_INFINITY,
): INavigation {
  let index: number = -1; // last write index
  const states: INavigationState[] = [];

  const history: History = getHistory();
  const location: Location = getLocation();


  // const log = (...args: any[]) => console.log(...args);
  const log = (...args: any[]) => {};

  const $onNavigation$ = createMulticastSource<INavigationNotification>();

  const dispatch = (name: INavigationEvent, state: INavigationState): void => {
    $onNavigation$.emit(createNotification<INavigationEvent, INavigationState>(name, state));
  };

  const onIntegrityError = (
    message: string = '',
  ): void => {
    console.error(`IntegrityError: ${ message }`);
    reset();
  };

  const reset = (): void => {
    states.length = 0;
    index = -1;
  };

  const getState = (_index: number = 0): INavigationState | null => {
    const historyIndex: number = index + _index;
    return (
      (0 <= historyIndex)
      && (historyIndex < states.length)
    )
      ? states[historyIndex]
      : null;
  };

  const createCurrentNavigationState = (): INavigationState => {
    return createNavigationState(new URL(location.href));
  };

  const createNavigationStateFromPushStateURL = (
    url?: string | null,
  ): INavigationState => {
    return createNavigationState(new URL(url ?? location.href, getBaseURI()));
  };

  const onPush = (state: INavigationState): void => {
    log('push');

    // because of a previous back, it's possible we created a new branch, so we remove forwards
    const nextIndex: number = index + 1;
    if (nextIndex !== states.length) {
      states.splice(nextIndex);
    }

    // we push current state into history
    states.push(state);

    // if states' length if greater than limit, remove x first states
    if (states.length > limit) {
      states.splice(0, states.length - limit);
    }

    // historyIndex is updated
    index = states.length - 1;

    // send a 'push' event
    dispatch('push', state);
  };

  const onRefresh = (state: INavigationState): void => {
    log('refresh');
    dispatch('refresh', state);
  };

  const onReplace = (state: INavigationState): void => {
    if (index < 0) {
      onPush(state);
    } else {
      if (historyStateEquals(state, states[index])) {
        onRefresh(state);
      } else {
        log('replace');
        states[index] = state;
        dispatch('replace', state);
      }
    }
  };

  const onBack = (state: INavigationState = createCurrentNavigationState()): void => {
    const previousState: INavigationState | null = getState(-1);
    if (previousState === null) {
      onIntegrityError('back / no previous location');
      onPush(state);
    } else if (!historyStateEquals(state, previousState)) {
      onIntegrityError('back / urls diverge');
      onPush(state);
    } else {
      log('back');
      index = Math.max(index - 1, -1);
      dispatch('back', state);
    }
  };

  const onForward = (state: INavigationState = createCurrentNavigationState()): void => {
    const nextState: INavigationState | null = getState(1);
    if (state === void 0) {
      state = nextState ?? createCurrentNavigationState();
    }

    if (nextState === null) {
      onIntegrityError('forward / no forward location');
      onPush(state);
    } else if (!historyStateEquals(state, nextState)) {
      onIntegrityError('forward / urls diverge');
      onPush(state);
    } else {
      log('forward');
      index = Math.min(index + 1, states.length - 1);
    }
    dispatch('forward', state);
  };


  patchObjectMethod(history, 'pushState', function (
    this: History,
    data: any,
    title: string,
    url?: string | null
  ): void {
    this.pushState(data, title, url);
    onPush(createNavigationStateFromPushStateURL(url));
  });

  patchObjectMethod(history, 'replaceState', function (
    this: History,
    data: any,
    title: string,
    url?: string | null
  ): void {
    this.replaceState(data, title, url);
    onReplace(createNavigationStateFromPushStateURL(url));
  });

  // let popstateDetected: boolean = false;
  // patchObjectMethod(history, 'back', function (this: History): void {
  //   popstateDetected = true;
  //   this.back();
  //   console.log(location.href);
  //   onBack();
  // });
  //
  // patchObjectMethod(history, 'forward', function (this: History): void {
  //   popstateDetected = true;
  //   this.forward();
  //   onForward();
  // });

  createEventListener(window, 'popstate', () => {
    // if (popstateDetected) {
    //   popstateDetected = false;
    // } else {
      const currentURL: string = location.href;
      const previousState: INavigationState | null = getState(-1);
      const nextState: INavigationState | null = getState(1);

      if ((previousState !== null) && (previousState.url.href === currentURL)) {
        onBack();
      } else if ((nextState !== null) && (nextState.url.href === currentURL)) {
        onForward();
      } else {
        onIntegrityError(`popstate out of bound`);
        onPush(createCurrentNavigationState());
      }
    // }
  });

  const back = (): void => {
    history.back();
  };

  const canBack = (): boolean => {
    return (index > 0);
  };

  const forward = (): void => {
    history.forward();
  };

  const canForward = (): boolean => {
    return ((index + 1) < states.length);
  };

  const navigate = (
    url: URL | string,
    replaceState: boolean = false,
  ): void => {
    if (typeof url === 'string') {
      return navigate(new URL(url, getBaseURI()), replaceState);
    } else {
      if (url.origin === location.origin) {
        if (replaceState) {
          history.replaceState(null, '', url.href);
        } else {
          history.pushState(null, '', url.href);
        }
      } else {
        const location: Location = getLocation();
        if (replaceState) {
          location.replace(url.href);
        } else {
          location.assign(url.href);
        }
      }
    }
  };

  onPush(createCurrentNavigationState());

  return {
    onChange: $onNavigation$.subscribe,
    getState,
    navigate,
    back,
    canBack,
    forward,
    canForward,
    reset,
  };
}

export const NAVIGATION = createNavigation();
