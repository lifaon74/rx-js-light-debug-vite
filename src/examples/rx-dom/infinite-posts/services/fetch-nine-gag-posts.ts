import {
  fromFetch, fromFetchJSON, fromPromise, IDefaultNotificationsUnion, IObservable,
  pipeObservable,
} from '@lifaon/rx-js-light';
import { noCORS } from '../../../misc/no-cors';

// https://9gag.com/v1/group-posts/group/default/type/hot?after=azMXb4Z%2Ca6EomPN%2CaB2xKY1&c=10

/** REQUEST **/

export interface INineGagJSONRequest {
  section: 'hot';
  after?: string;
  count?: number;
}


/** RESPONSE **/

export interface INineGagJSONResponsePostImage {
  width: number;
  height: number;
  url: string;
  webpUrl?: string;
  hasAudio: number;
  duration: number;
  vp8Url: string;
  h265Url: string;
  vp9Url: string;
  av1Url: string;
}

export type INineGagPostType = 'Animated' | 'Photo';

export interface INineGagJSONResponsePost {
  id: string;
  url: string;
  title: string;
  type: INineGagPostType,
  images: {
    [key: string]: INineGagJSONResponsePostImage;
  };
}

export interface INineGagJSONResponseData {
  posts: INineGagJSONResponsePost[];
}

export interface INineGagJSONResponse {
  data: INineGagJSONResponseData;
}


export function fetchNineGagPosts(
  request: INineGagJSONRequest,
): IObservable<IDefaultNotificationsUnion<INineGagJSONResponse>> {
  const url = new URL(`https://9gag.com/v1/group-posts/group/default/type/${ request.section }`);

  if (request.after !== void 0) {
    url.searchParams.set('after', request.after);
  }

  url.searchParams.set('c', String((request.count === void 0) ? 10 : request.count));

  return fromFetchJSON<INineGagJSONResponse>(noCORS(url.href));
}
