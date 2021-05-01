import { fetchJSON } from '../../../helpers/fetch-json';
import { forgeMusicBrainzSearchURL, IForgeMusicBrainzSearchURLOptions } from '../helpers/forge-music-brainz-search-url';

/** SEARCH TRACK **/

/* REQUEST */


export type IMusicBrainzSearchRecordingOptions = Omit<IForgeMusicBrainzSearchURLOptions, 'entity'>;

/* RESPONSE */

export interface IMusicBrainzSearchRecordingRecordingReleaseGroupJSONResponse {
  id: string;
  'type-id': string;
  'primary-type-id': string;
  title: string;
  'primary-type': 'Album';
}

export interface IMusicBrainzSearchRecordingRecordingReleaseEventJSONResponse {
  date: string; // ISO date
  area: IMusicBrainzSearchRecordingRecordingReleaseEventAreaJSONResponse;
}

export interface IMusicBrainzSearchRecordingRecordingReleaseEventAreaJSONResponse {
  id: string;
  name: string;
  'sort-name': string;
  'iso-3166-1-codes': string[];
}


export interface IMusicBrainzSearchRecordingRecordingReleaseMediaJSONResponse {
  position: number;
  format: 'Digital Media'; // TODO enum ?
  track:IMusicBrainzSearchRecordingRecordingReleaseMediaTrackJSONResponse[],
  'track-count': number;
  'track-offset': number;
}

export interface IMusicBrainzSearchRecordingRecordingReleaseMediaTrackJSONResponse {
  id: string;
  number: string;
  title: string;
  length: number;
}

export interface IMusicBrainzSearchRecordingRecordingReleaseJSONResponse {
  id: string;
  'status-id': string;
  count: number;
  title: string;
  status: string;
  'release-group': IMusicBrainzSearchRecordingRecordingReleaseGroupJSONResponse,
  date: string; // ISO date
  'country': string;
  'release-events': IMusicBrainzSearchRecordingRecordingReleaseEventJSONResponse[],
  'track-count': number;
  media: IMusicBrainzSearchRecordingRecordingReleaseMediaJSONResponse[];
}

/*--*/

export interface IMusicBrainzSearchRecordingRecordingArtistCreditArtistAliasJSONResponse {
  'sort-name': string;
  'type-id': string;
  name: string;
  locale: null;
  type: string;
  primary: null;
  'begin-date': null;
  'end-date': null;
}

export interface IMusicBrainzSearchRecordingRecordingArtistCreditArtistJSONResponse {
  id: string;
  name: string;
  'sort-name': string;
  disambiguation?: string;
  'aliases'?: IMusicBrainzSearchRecordingRecordingArtistCreditArtistAliasJSONResponse[];
}

export interface IMusicBrainzSearchRecordingRecordingArtistCreditJSONResponse {
  name: string;
  artist: IMusicBrainzSearchRecordingRecordingArtistCreditArtistJSONResponse;
}

/*--*/

export interface IMusicBrainzSearchRecordingRecordingJSONResponse {
  id: string;
  score: number;
  title: string;
  length: number; // in ms
  video: null;
  'artist-credit': IMusicBrainzSearchRecordingRecordingArtistCreditJSONResponse[];
  'first-release-date': string; // ISO date
  releases: IMusicBrainzSearchRecordingRecordingReleaseJSONResponse[];
}

export interface IMusicBrainzSearchRecordingJSONResponse {
  created: string; // ISO date
  count: number;
  offset: number;
  recordings: IMusicBrainzSearchRecordingRecordingJSONResponse[];
}


/* FETCH */

export function musicBrainzSearchRecording(
  options: IMusicBrainzSearchRecordingOptions,
  signal?: AbortSignal,
): Promise<IMusicBrainzSearchRecordingJSONResponse> {
  return fetchJSON<IMusicBrainzSearchRecordingJSONResponse>(
    forgeMusicBrainzSearchURL({
      ...options,
      entity: 'recording',
    }).href,
    { signal },
  );
}
