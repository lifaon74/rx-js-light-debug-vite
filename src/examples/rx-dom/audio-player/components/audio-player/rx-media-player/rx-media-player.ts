import {
  fromEventTarget, function$$, IObservable, IObserver, map$$, merge, reference,
} from '@lifaon/rx-js-light';
import { distinctSharedR$$ } from '../distinct-shared-replay-last';

/** MEDIA **/

export type IRXMediaPlayState =
  | 'loading'
  | 'playing'
  | 'paused'
  | 'errored'
  ;

export interface IRXMediaPlayerPlay {
  (): Promise<void>;
}

export interface IRXMediaPlayerPause {
  (): void;
}

export interface IRXMediaPlayer {
  readonly play: IRXMediaPlayerPlay;
  readonly pause: IRXMediaPlayerPause;

  readonly playState$: IObservable<IRXMediaPlayState>;

  readonly currentTime$: IObservable<number>;
  readonly $currentTime: IObserver<number>;

  readonly duration$: IObservable<number>;

  readonly progress$: IObservable<number>;

  readonly volume$: IObservable<number>;
  readonly $volume: IObserver<number>;
}


export function createRXMediaPlayer(
  element: HTMLMediaElement,
): IRXMediaPlayer {

  element.loop = false;
  element.autoplay = false;
  element.muted = false;

  const getCurrentPlayState = (): IRXMediaPlayState => {
    return (element.readyState === element.HAVE_NOTHING)
      ? 'paused'
      : (
        (element.readyState === element.HAVE_ENOUGH_DATA)
          ? (
            element.paused
              ? 'paused'
              : 'playing'
          )
          : 'loading'
      );
  };

  const playState$ = distinctSharedR$$(
    merge([
      reference<IRXMediaPlayState>(() => getCurrentPlayState()),
      map$$<Event, IRXMediaPlayState>(fromEventTarget(element, 'emptied'), () => 'loading'),
      map$$<Event, IRXMediaPlayState>(fromEventTarget(element, 'pause'), () => 'paused'),
      map$$<Event, IRXMediaPlayState>(fromEventTarget(element, 'playing'), () => 'playing'),
    ]),
  );


  const currentTime$ = distinctSharedR$$(
    merge([
      reference(() => element.currentTime),
      map$$(fromEventTarget(element, 'timeupdate'), () => element.currentTime),
    ]),
  );

  const $currentTime = (value: number): void => {
    element.currentTime = value;
  };


  const duration$ = distinctSharedR$$(
    merge([
      reference(() => element.duration),
      map$$(fromEventTarget(element, 'durationchange'), () => element.duration),
    ]),
  );

  const progress$ = distinctSharedR$$(function$$([
    currentTime$,
    duration$,
  ], (
    currentTime: number,
    duration: number,
  ): number => {
    return currentTime / duration;
  }));

  const volume$ = distinctSharedR$$(
    merge([
      reference(() => element.volume),
      map$$(fromEventTarget(element, 'volumechange'), () => element.volume),
    ]),
  );

  const $volume = (value: number): void => {
    element.volume = value;
  };

  const play = (): Promise<void> => {
    return element.play();
  };

  const pause = (): void => {
    return element.pause();
  };

  return {
    play,
    pause,

    playState$,

    currentTime$,
    $currentTime,

    duration$,

    progress$,

    volume$,
    $volume,
  }

}

