import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate, querySelectorOrThrow, subscribeOnNodeConnectedTo
} from '@lifaon/rx-dom';
import { fromEventTarget, IEmitFunction, ISubscribeFunction, merge, noop, of } from '@lifaon/rx-js-light';
// @ts-ignore
import html from './audio-player.component.html?raw';
// @ts-ignore
import style from './audio-player.component.scss';
import {
  const$$, distinctSharedR$$, function$$, letU$$, map$$, mergeMapS$$, ref$$
} from '@lifaon/rx-js-light-shortcuts';
import { toPercent, toPercent$$ } from '../../../../rx-js-light/helpers/to-percent-subscribe-pipe';
import { formatDuration } from '../../../../rx-js-light/helpers/format-duration';


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

  readonly playState$: ISubscribeFunction<IRXMediaPlayState>;

  readonly currentTime$: ISubscribeFunction<number>;
  readonly $currentTime: IEmitFunction<number>;

  readonly duration$: ISubscribeFunction<number>;

  readonly progress$: ISubscribeFunction<number>;

  readonly volume$: ISubscribeFunction<number>;
  readonly $volume: IEmitFunction<number>;
}

export class RXMediaPlayer<GElement extends HTMLMediaElement> implements IRXMediaPlayer {
  // @Input()
  // src$: ISubscribeFunction<any>

  readonly element: GElement;

  readonly playState$: ISubscribeFunction<IRXMediaPlayState>;

  readonly currentTime$: ISubscribeFunction<number>;
  readonly $currentTime: IEmitFunction<number>;

  readonly duration$: ISubscribeFunction<number>;

  readonly progress$: ISubscribeFunction<number>;

  readonly volume$: ISubscribeFunction<number>;
  readonly $volume: IEmitFunction<number>;

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
        ref$$<IRXMediaPlayState>(() => getCurrentPlayState()),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'emptied'), () => 'loading'),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'pause'), () => 'paused'),
        map$$<Event, IRXMediaPlayState>(fromEventTarget(this.element, 'playing'), () => 'playing'),
      ]),
    );


    this.currentTime$ = distinctSharedR$$(
      merge([
        ref$$(() => this.element.currentTime),
        map$$(fromEventTarget(this.element, 'timeupdate'), () => this.element.currentTime),
      ]),
    );

    this.$currentTime = (value: number): void => {
      this.element.currentTime = value;
    };


    this.duration$ = distinctSharedR$$(
      merge([
        ref$$(() => this.element.duration),
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
        ref$$(() => this.element.volume),
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
  left: ISubscribeFunction<string>;
  width: ISubscribeFunction<string>;
}

interface IData {
  readonly loadedChunks$: ISubscribeFunction<readonly IDataChunk[]>;

  readonly trackProgressWidth$: ISubscribeFunction<string>;
  readonly onMouseUpProgressBar: IEmitFunction<MouseEvent>;
  readonly onMouseMoveProgressBar: IEmitFunction<MouseEvent>;
  readonly cursorTimeTooltipLeftPosition$: ISubscribeFunction<string>;
  readonly cursorTimeTooltipText$: ISubscribeFunction<string>;

  readonly previousTrackButtonTitle$: ISubscribeFunction<string>;
  readonly previousTrackButtonDisabled$: ISubscribeFunction<boolean>;

  readonly pauseButtonTitle$: ISubscribeFunction<string>;
  readonly pauseButtonVisible$: ISubscribeFunction<boolean>;
  readonly onClickPauseButton: IEmitFunction<any>;

  readonly playButtonTitle$: ISubscribeFunction<string>;
  readonly playButtonVisible$: ISubscribeFunction<boolean>;
  readonly onClickPlayButton: IEmitFunction<any>;

  readonly loaderTitle$: ISubscribeFunction<string>;
  readonly loaderVisible$: ISubscribeFunction<boolean>;

  readonly nextTrackButtonTitle$: ISubscribeFunction<string>;
  readonly nextTrackButtonDisabled$: ISubscribeFunction<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-audio-player',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppAudioPlayerComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();
    // type TAudio = RXMediaPlayer<HTMLAudioElement>;
    type TAudio = IRXMediaPlayer;
    const audio$ = const$$(new RXMediaPlayer(new Audio('/assets/audio/audio-sample-01.mp3')));

    const duration$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return audio.duration$;
    });

    const loadedChunks$ = const$$([{ left: of('0%'), width: of('75%') }]);

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
      }
    );

    const cursorTimeTooltipText$ = function$$(
      [duration$, mouseMoveProgressBar$],
      (duration: number, event: MouseEvent): string => {
        return formatDuration(getMouseCursorProgress(event) * duration);
      },
    );


    const previousTrackButtonTitle$ = const$$('Previous track');
    const previousTrackButtonDisabled$ = const$$(false);

    const pauseButtonTitle$ = const$$('Pause');
    const pauseButtonVisible$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'playing'));
    });


    const playButtonTitle$ = const$$('Play');
    const playButtonVisible$ = mergeMapS$$(audio$, (audio: TAudio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'paused'));
    });


    const loaderTitle$ = const$$('Loading');
    const loaderVisible$ = mergeMapS$$(audio$, (audio) => {
      return map$$(audio.playState$, (playState: IRXMediaPlayState) => (playState === 'loading'));
    });

    const nextTrackButtonTitle$ = const$$('Next track');
    const nextTrackButtonDisabled$ = const$$(true);

    let onClickPauseButton: IEmitFunction<void> = noop;
    let onClickPlayButton: IEmitFunction<void> = noop;

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

