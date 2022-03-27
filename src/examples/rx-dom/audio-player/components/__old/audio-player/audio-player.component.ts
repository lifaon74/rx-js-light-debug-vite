import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate, querySelectorOrThrow,
  subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
import {
  distinct$$, fromEventTarget, function$$, IObservable, IObserver, letU$$, map$$, merge, mergeMapS$$, noop, reference,
  shareRL$$, single,
} from '@lifaon/rx-js-light';
// @ts-ignore
import html from './audio-player.component.html?raw';
// @ts-ignore
import style from './audio-player.component.scss';
import { toPercent, toPercent$$ } from '../../../../rx-js-light/helpers/to-percent-subscribe-pipe';
import { formatDuration } from '../../../../rx-js-light/helpers/format-duration';

// import { formatDuration } from '@lifaon/rx-js-light';

/** MEDIA **/

export function distinctSharedR$$<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return shareRL$$(distinct$$<GValue>(subscribe));
}

/** MEDIA **/

export type IRXMediaPlayState =
  | 'loading'
  | 'playing'
  | 'paused'
  | 'errored'
  ;

export interface IRXMediaPlayer {
  readonly play: () => Promise<void>;
  readonly pause: () => void;

  readonly playState$: IObservable<IRXMediaPlayState>;

  readonly currentTime$: IObservable<number>;
  readonly $currentTime: IObserver<number>;

  readonly duration$: IObservable<number>;

  readonly progress$: IObservable<number>;

  readonly volume$: IObservable<number>;
  readonly $volume: IObserver<number>;
}

export class RXMediaPlayer<GElement extends HTMLMediaElement> implements IRXMediaPlayer {
  // @Input()
  // src$: IObservable<any>

  readonly element: GElement;

  readonly playState$: IObservable<IRXMediaPlayState>;

  readonly currentTime$: IObservable<number>;
  readonly $currentTime: IObserver<number>;

  readonly duration$: IObservable<number>;

  readonly progress$: IObservable<number>;

  readonly volume$: IObservable<number>;
  readonly $volume: IObserver<number>;

  constructor(
    element: GElement,
  ) {
    this.element = element;

    this.element.loop = false;
    this.element.autoplay = false;
    this.element.muted = false;

    const getCurrentPlayState = (): IRXMediaPlayState => {
      return (this.element.readyState === this.element.HAVE_NOTHING)
        ? 'paused'
        : (
          (this.element.readyState === this.element.HAVE_ENOUGH_DATA)
            ? (
              this.element.paused
                ? 'paused'
                : 'playing'
            )
            : 'loading'
        );
    };

    this.playState$ = distinctSharedR$$(
      merge([
        reference<IRXMediaPlayState>(() => getCurrentPlayState()),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'emptied'), () => 'loading'),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'pause'), () => 'paused'),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'playing'), () => 'playing'),
      ]),
    );


    this.currentTime$ = distinctSharedR$$(
      merge([
        reference(() => this.element.currentTime),
        map$$(fromEventTarget(this.element, 'timeupdate'), () => this.element.currentTime),
      ]),
    );

    this.$currentTime = (value: number): void => {
      this.element.currentTime = value;
    };


    this.duration$ = distinctSharedR$$(
      merge([
        reference(() => this.element.duration),
        map$$(fromEventTarget(this.element, 'durationchange'), () => this.element.duration),
      ]),
    );

    this.progress$ = distinctSharedR$$(function$$([
      this.currentTime$,
      this.duration$,
    ], (
      currentTime: number,
      duration: number,
    ): number => {
      return currentTime / duration;
    }));

    this.volume$ = distinctSharedR$$(
      merge([
        reference(() => this.element.volume),
        map$$(fromEventTarget(this.element, 'volumechange'), () => this.element.volume),
      ]),
    );

    this.$volume = (value: number): void => {
      this.element.volume = value;
    };
  }

  play(): Promise<void> {
    return this.element.play();
  }

  pause(): void {
    return this.element.pause();
  }
}


/** COMPONENT **/


interface IDataChunk {
  left: IObservable<string>;
  width: IObservable<string>;
}

interface IData {
  readonly loadedChunks$: IObservable<readonly IDataChunk[]>;

  readonly trackProgressWidth$: IObservable<string>;
  readonly onMouseUpProgressBar: IObserver<MouseEvent>;
  readonly onMouseMoveProgressBar: IObserver<MouseEvent>;
  readonly cursorTimeTooltipLeftPosition$: IObservable<string>;
  readonly cursorTimeTooltipText$: IObservable<string>;

  readonly previousTrackButtonTitle$: IObservable<string>;
  readonly previousTrackButtonDisabled$: IObservable<boolean>;

  readonly pauseButtonTitle$: IObservable<string>;
  readonly pauseButtonVisible$: IObservable<boolean>;
  readonly onClickPauseButton: IObserver<any>;

  readonly playButtonTitle$: IObservable<string>;
  readonly playButtonVisible$: IObservable<boolean>;
  readonly onClickPlayButton: IObserver<any>;

  readonly loaderTitle$: IObservable<string>;
  readonly loaderVisible$: IObservable<boolean>;

  readonly nextTrackButtonTitle$: IObservable<string>;
  readonly nextTrackButtonDisabled$: IObservable<boolean>;
}

@Component({
  name: 'app-audio-player',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppAudioPlayerComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();
    // type TAudio = RXMediaPlayer<HTMLAudioElement>;
    type TAudio = IRXMediaPlayer;
    const audio$ = single(new RXMediaPlayer(new Audio('/assets/audio/audio-sample-01.mp3')));

    const duration$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return audio.duration$;
    });

    const loadedChunks$ = single([{ left: single('0%'), width: single('75%') }]);

    const trackProgressWidth$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return toPercent$$(audio.progress$);
    });

    const $mouseUpProgressBar$ = letU$$<MouseEvent>();
    const mouseUpProgressBar$ = $mouseUpProgressBar$.subscribe;

    function$$(
      [audio$, duration$, mouseUpProgressBar$],
      (audio: TAudio, duration: number, event: MouseEvent): void => {
        audio.$currentTime(getMouseCursorProgress(event) * duration);
      },
    )(noop);

    const $mouseMoveProgressBar$ = letU$$<MouseEvent>();
    const mouseMoveProgressBar$ = $mouseMoveProgressBar$.subscribe;
    const cursorTimeTooltipLeftPosition$ = map$$(
      mouseMoveProgressBar$,
      (event: MouseEvent): string => {
        const progressBarElement: HTMLElement = (event.currentTarget as HTMLElement);
        const tooltipElement: HTMLElement = querySelectorOrThrow(
          progressBarElement,
          ':scope >.cursor-time-tooltip',
        );

        const progressBarClientRect: DOMRect = progressBarElement.getBoundingClientRect();
        const tooltipClientRect: DOMRect = tooltipElement.getBoundingClientRect();

        const cursorXPosition: number = (event.clientX - progressBarClientRect.left) / progressBarClientRect.width;
        const tooltipWidth: number = tooltipClientRect.width / progressBarClientRect.width;
        const tooltipMaxLeft: number = 1 - tooltipWidth;
        const tooltipOffset: number = tooltipWidth / 2;
        const left: number = cursorXPosition - tooltipOffset;

        return toPercent(Math.max(0, Math.min(tooltipMaxLeft, left)));
      },
    );

    const cursorTimeTooltipText$ = function$$(
      [duration$, mouseMoveProgressBar$],
      (duration: number, event: MouseEvent): string => {
        return formatDuration(getMouseCursorProgress(event) * duration);
      },
    );


    const previousTrackButtonTitle$ = single('Previous track');
    const previousTrackButtonDisabled$ = single(false);

    const pauseButtonTitle$ = single('Pause');
    const pauseButtonVisible$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'playing'));
    });


    const playButtonTitle$ = single('Play');
    const playButtonVisible$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'paused'));
    });


    const loaderTitle$ = single('Loading');
    const loaderVisible$ = mergeMapS$$(audio$, (audio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'loading'));
    });

    const nextTrackButtonTitle$ = single('Next track');
    const nextTrackButtonDisabled$ = single(true);

    let onClickPauseButton: IObserver<void> = noop;
    let onClickPlayButton: IObserver<void> = noop;

    const getMouseCursorProgress = (
      event: MouseEvent,
    ): number => {
      const clientRect: DOMRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      return (event.clientX - clientRect.left) / clientRect.width;
    };

    subscribeOnNodeConnectedTo(this, audio$, (audio: TAudio) => {
      onClickPlayButton = () => {
        audio.play();
      };

      onClickPauseButton = () => {
        audio.pause();
      };
    });

    this._data = {
      loadedChunks$,

      trackProgressWidth$,
      onMouseUpProgressBar: $mouseUpProgressBar$.emit,
      onMouseMoveProgressBar: $mouseMoveProgressBar$.emit,
      cursorTimeTooltipLeftPosition$,
      cursorTimeTooltipText$,

      previousTrackButtonTitle$,
      previousTrackButtonDisabled$,

      pauseButtonTitle$,
      pauseButtonVisible$,
      onClickPauseButton: () => onClickPauseButton(),

      playButtonTitle$,
      playButtonVisible$,
      onClickPlayButton: () => onClickPlayButton(),

      loaderTitle$,
      loaderVisible$,

      nextTrackButtonTitle$,
      nextTrackButtonDisabled$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

