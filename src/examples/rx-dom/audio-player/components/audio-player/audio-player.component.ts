import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, createElement, getDocumentBody,
  nodeAppendChild,
  OnCreate,
} from '@lirx/dom';
import { $log, IObservable, IObserver, map$$, not$$, single } from '@lirx/core';
// @ts-ignore
import html from './audio-player.component.html?raw';
// @ts-ignore
import style from './audio-player.component.scss';
import { createRXMediaPlayer, IRXMediaPlayState } from './rx-media-player/rx-media-player';
import { createRXMediaListPlayer } from './rx-media-player/rx-tracks-player';

// import { formatDuration } from '@lirx/core';


/** FUNCTION **/

function debugAudio() {
  const audio = createRXMediaPlayer(new Audio('/assets/audio/audio-sample-01.mp3'));
  audio.playState$($log);
  window.onclick = audio.play;
  // audio.play();
}

function debugAudioList() {
  const audioA = createRXMediaPlayer(new Audio('/assets/audio/audio-sample-01.mp3'));
  const audioB = createRXMediaPlayer(new Audio('/assets/audio/audio-sample-02.mp3'));

  const list = createRXMediaListPlayer();

  list.playState$($log);

  const createButton = (name: string): HTMLButtonElement => {
    const button =  createElement('button');
    button.innerText = name;
    nodeAppendChild(getDocumentBody(), button);
    return button;
  };

  const playButton = createButton('play');
  playButton.onclick = list.play;

  const pauseButton = createButton('pause');
  pauseButton.onclick = list.pause;

  list.$tracks([
    audioB,
    audioA,
  ]);


  // audio.play();
}

/** COMPONENT **/


interface IDataChunk {
  left: IObservable<string>;
  width: IObservable<string>;
}

interface IData {
  // readonly loadedChunks$: IObservable<readonly IDataChunk[]>;
  //
  // readonly trackProgressWidth$: IObservable<string>;
  // readonly onMouseUpProgressBar: IObserver<MouseEvent>;
  // readonly onMouseMoveProgressBar: IObserver<MouseEvent>;
  // readonly cursorTimeTooltipLeftPosition$: IObservable<string>;
  // readonly cursorTimeTooltipText$: IObservable<string>;
  //
  // readonly previousTrackButtonTitle$: IObservable<string>;
  readonly previousTrackButtonDisabled$: IObservable<boolean>;

  // readonly pauseButtonTitle$: IObservable<string>;
  readonly pauseButtonVisible$: IObservable<boolean>;
  readonly onClickPauseButton: IObserver<any>;
  //
  // readonly playButtonTitle$: IObservable<string>;
  readonly playButtonVisible$: IObservable<boolean>;
  readonly onClickPlayButton: IObserver<any>;
  //
  // readonly loaderTitle$: IObservable<string>;
  readonly loaderVisible$: IObservable<boolean>;
  //
  // readonly nextTrackButtonTitle$: IObservable<string>;
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

    // debugAudio();
    // debugAudioList();

    const audioA = createRXMediaPlayer(new Audio('/assets/audio/audio-sample-01.mp3'));
    const audioB = createRXMediaPlayer(new Audio('/assets/audio/audio-sample-02.mp3'));

    const list = createRXMediaListPlayer();


    const pauseButtonVisible$ = map$$(list.playState$, (playState: IRXMediaPlayState) => (playState === 'playing'));
    const onClickPauseButton = (): void => {
      list.pause();
    };


    const playButtonVisible$ = map$$(list.playState$, (playState: IRXMediaPlayState) => (playState === 'paused'));
    const onClickPlayButton = (): void => {
      list.play();
    };

    const loaderVisible$ = map$$(list.playState$, (playState: IRXMediaPlayState) => (playState === 'loading'));

    const previousTrackButtonDisabled$ = not$$(list.canPrevious$);
    const nextTrackButtonDisabled$ = not$$(list.canNext$);

    this._data = {
      previousTrackButtonDisabled$,

      pauseButtonVisible$,
      onClickPauseButton,

      playButtonVisible$,
      onClickPlayButton,

      loaderVisible$,

      nextTrackButtonDisabled$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

