import {
  fromFetch, fromPromise, IDefaultNotificationsUnion, IObservable, IObservableFromFetchNotifications,
  mapObservablePipeWithNotifications, mergeMapObservablePipeWithNotifications, pipeObservable
} from '@lifaon/rx-js-light';
import { noCORS } from '../../../misc/no-cors';
import { IImageResource, IResource, IYoutubeResource } from './resource.type';


/** REQUEST **/

export interface IMonkeyUserRequest {
  next?: string;
}

/** RESPONSE **/

export interface IMonkeyUserResponse {
  resource: IResource;
  next: string | null;
}


export function fetchMonkeyUsersPosts(
  {
    next = '',
  }: IMonkeyUserRequest = {},
): IObservable<IDefaultNotificationsUnion<IMonkeyUserResponse>> {
  const url = new URL(`https://www.monkeyuser.com`);
  url.pathname = next;

  return pipeObservable(fromFetch(noCORS(url.href)), [
    mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, any>((response: Response) => {
      return fromPromise<string>(response.text());
    }, 1),
    mapObservablePipeWithNotifications<IDefaultNotificationsUnion<string>, IMonkeyUserResponse>((html: string): IMonkeyUserResponse => {
      const document: Document = new DOMParser().parseFromString(html, 'text/html');

      let resource: IResource;
      let next: string | null;

      const nextElement: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>('.post .timeline .prev a');

      if (nextElement === null) {
        next = null;
      } else {
        next = new URL(nextElement.href, window.origin).pathname;
      }

      const imageElement: HTMLImageElement | null = document.querySelector<HTMLImageElement>('.post .content img');

      if (imageElement === null) {
        const match = new RegExp(`videoId: "([^"]+)"`).exec(html);
        if (match === null) {
          throw new Error(`Cannot find image`);
        } else {
          resource = {
            kind: 'youtube',
            url: `https://www.youtube.com/embed/${ match[1] }`,
          } as IYoutubeResource;
        }
      } else {
        resource = {
          kind: 'image',
          url: imageElement.src,
        } as IImageResource;
      }

      return {
        resource,
        next,
      };
    }),
  ]);
}
