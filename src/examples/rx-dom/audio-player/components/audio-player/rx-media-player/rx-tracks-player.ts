import {
  function$$, IObservable, IObserver, IUnsubscribe, let$$, map$$, mergeMapS$$, readObservableValue, single,
} from '@lifaon/rx-js-light';
import { IRXMediaPlayer, IRXMediaPlayState } from './rx-media-player';

/** MEDIA **/


// export interface IRXTracksPlayerAdd {
//   (
//     tracks: IRXMediaPlayer[],
//   ): void;
// }
//
//
// export interface IRXTracksPlayerRemove {
//   (
//     ...tracks: IRXMediaPlayer[],
//   ): void;
// }

export interface IRXTracksPlayerStop {
  (): void;
}

// export interface IRXTracksPlayerPlay extends IRXMediaPlayerPlay {
// }
//
// export interface IRXTracksPlayerPause extends IRXMediaPlayerPause {
// }

export interface IRXTracksPlayerPrevious {
  (): void;
}

export interface IRXTracksPlayerNext {
  (): void;
}

export type IRXTracksPlayerCurrentTrack = IRXMediaPlayer | null;
export type IRXTracksPlayerTracksList = readonly IRXMediaPlayer[];

export interface IRXTracksPlayer extends Pick<IRXMediaPlayer, 'play' | 'pause' | 'playState$'> {
  // readonly add: IRXTracksPlayerAdd;
  // readonly remove: IRXTracksPlayerRemove;
  // readonly stop: IRXTracksPlayerAdd;
  // readonly play: IRXTracksPlayerPlay;
  // readonly pause: IRXTracksPlayerPause;
  readonly canPrevious$: IObservable<boolean>;
  readonly previous: IRXTracksPlayerPrevious;
  readonly canNext$: IObservable<boolean>;
  readonly next: IRXTracksPlayerNext;

  readonly $tracks: IObserver<IRXTracksPlayerTracksList>;
  readonly tracks$: IObservable<IRXTracksPlayerTracksList>;
  readonly currentTrack$: IObservable<IRXTracksPlayerCurrentTrack>;
}


export function createRXMediaListPlayer(): IRXTracksPlayer {


  const { emit: _$trackIndex, subscribe: trackIndex$, getValue: getTrackIndex } = let$$<number>(-1);

  const { emit: _$tracks, subscribe: tracks$, getValue: getTracks } = let$$<IRXTracksPlayerTracksList>([]);

  const getCurrentTrack = (
    tracks: IRXTracksPlayerTracksList = getTracks(),
    trackIndex: number = getTrackIndex(),
  ): IRXTracksPlayerCurrentTrack => {
    return (trackIndex === -1)
      ? null
      : tracks[trackIndex];
  };

  const currentTrack$ = function$$(
    [tracks$, trackIndex$],
    getCurrentTrack,
  );

  // const stop = (): void => {
  //   $trackIndex(-1);
  // };

  // tracks$((tracks: IRXMediaPlayer[]) => {
  //   if (tracks.length <= getTrackIndex()) {
  //     stop();
  //   }
  // });

  // trackIndex$((trackIndex: number) => {
  //   getTracks().forEach((track: IRXMediaPlayer): void => {
  //     track.pause();
  //   });
  //   play();
  // });

  const play = (): Promise<void> => {
    const trackIndex: number = getTrackIndex();
    if (trackIndex === -1) {
      next();
    }
    const currentTrack: IRXTracksPlayerCurrentTrack = getCurrentTrack();
    return (currentTrack === null)
      ? Promise.resolve()
      : currentTrack.play();
  };

  const pause = (): void => {
    const currentTrack: IRXTracksPlayerCurrentTrack = getCurrentTrack();
    if (currentTrack !== null) {
      currentTrack.pause();
    }
  };

  const playState$ = mergeMapS$$(currentTrack$, (currentTrack: IRXTracksPlayerCurrentTrack) => {
    return (currentTrack === null)
      ? single<IRXMediaPlayState>('paused')
      : currentTrack.playState$;
  });


  let unsubscribeOfCurrentTrackProgress: IUnsubscribe | undefined;

  const $trackIndex = (
    trackIndex: number,
  ): void => {
    if (unsubscribeOfCurrentTrackProgress !== void 0) {
      unsubscribeOfCurrentTrackProgress();
      unsubscribeOfCurrentTrackProgress === void 0;
    }

    const tracks: IRXTracksPlayerTracksList = getTracks();
    if ((-1 <= trackIndex) && (trackIndex < tracks.length)) {

      const currentTrack: IRXTracksPlayerCurrentTrack = getCurrentTrack();
      const newCurrentTrack: IRXTracksPlayerCurrentTrack = (trackIndex === -1)
        ? null
        : tracks[trackIndex];

      if (currentTrack == null) {
        _$trackIndex(trackIndex);
      } else {
        const playState: IRXMediaPlayState = readObservableValue(currentTrack.playState$, (): never => {
          throw new Error(`Cannot read playState$`);
        });
        currentTrack.pause();
        if (
          (newCurrentTrack !== null)
          && (
            (playState === 'playing')
            || (playState === 'loading')
          )
        ) {
          newCurrentTrack.play();
        }
        _$trackIndex(trackIndex);
      }

      if (newCurrentTrack !== null) {
        unsubscribeOfCurrentTrackProgress = newCurrentTrack.progress$((progress: number) => {
          if (progress >= 1) {
            next();
          }
        });
      }
    } else {
      throw new RangeError(`Invalid trackIndex: ${trackIndex}`);
    }
  };

  const $tracks = (
    tracks: IRXTracksPlayerTracksList,
  ): void => {
    const currentTrack: IRXTracksPlayerCurrentTrack = getCurrentTrack();

    $trackIndex(-1);
    _$tracks(tracks);

    if (currentTrack !== null) {
      const newCurrentTrackIndex: number = tracks.findIndex((track: IRXMediaPlayer): boolean => {
        return track === currentTrack;
      });

      if (newCurrentTrackIndex === -1) {
        currentTrack.pause();
      } else {
        $trackIndex(newCurrentTrackIndex);
      }
    }
  };

  const canPrevious = (
    trackIndex: number = getTrackIndex(),
  ): boolean => {
    return trackIndex > 0;
  };

  const canPrevious$ = map$$(trackIndex$, canPrevious);

  const previous = (): void => {
    if (canPrevious()) {
      $trackIndex(getTrackIndex() - 1);
    }
  };

  const canNext = (
    trackIndex: number = getTrackIndex(),
    tracks: IRXTracksPlayerTracksList = getTracks(),
  ): boolean => {
    return (trackIndex + 1) < tracks.length;
  };
  const canNext$ = function$$([trackIndex$, tracks$], canNext);

  const next = (): void => {
    if (canNext()) {
      $trackIndex(getTrackIndex() + 1);
    }
  };

  return {
    // from media player
    play,
    pause,

    playState$,

    // extended
    canPrevious$,
    previous,
    next,
    canNext$,


    $tracks,
    tracks$,
    currentTrack$,
  };

}

