import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import style from './youtube-player.component.scss';
// @ts-ignore
import html from './youtube-player.component.html?raw';
import { fromFetchJSON, IFromFetchJSONObservableNotifications, IObservable } from '@lirx/core';
import { noCORS } from '../../../misc/no-cors';

/** COMPONENT **/

// https://www.youtube.com/watch?v=aqz-KE-bpKQ

interface IData {
  // readonly content$: IObservable<IDocumentFragmentOrNull>;
}

@Component({
  name: 'app-youtube-player',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class YoutubePlayerComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();


    this.data = {};

    fetchData(`aqz-KE-bpKQ`)((_) => {
      console.log(_);
    });
  }

  onCreate(): IData {
    return this.data;
  }
}



function fetchData(
  videoId: string,
): IObservable<IFromFetchJSONObservableNotifications<any>> {
  const eurl: string = `https://youtube.googleapis.com/v/${videoId}`;
  const url: string = `https://www.youtube.com/get_video_info?video_id=${videoId}&el=embedded&eurl=${eurl}&sts=18333`;
  console.log(url);
  return fromFetchJSON(noCORS(url));
}
