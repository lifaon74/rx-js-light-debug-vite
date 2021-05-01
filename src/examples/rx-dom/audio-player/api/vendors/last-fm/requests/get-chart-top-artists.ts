import { forgeLastFMGetURL } from '../helpers/forge-last-fm-get-url';
import { fetchLastFMJSON } from '../helpers/fetch-last-fm-json';

/** GET CHART TOP ARTISTS **/

/* REQUEST */

// JSON

// NORMALIZED

export interface IGetChartTopArtistsOptions {
  page?: number; // (default: 0)
  limit?: number; // (default: 10)
}

/* RESPONSE */

// JSON

export type IGetChartTopArtistsArtistsArtistImageSizeJSONResponse  = 'small' | 'medium' | 'large' | 'extralarge' | 'mega';

export interface IGetChartTopArtistsArtistsArtistImageJSONResponse {
  '#text': string;
  size: IGetChartTopArtistsArtistsArtistImageSizeJSONResponse;
}

export interface IGetChartTopArtistsArtistsArtistJSONResponse {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: IGetChartTopArtistsArtistsArtistImageJSONResponse[];
}

export interface IGetChartTopArtistsArtistsAttrJSONResponse {
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}

export interface IGetChartTopArtistsArtistsJSONResponse {
  '@attr': IGetChartTopArtistsArtistsAttrJSONResponse;
  artist: IGetChartTopArtistsArtistsArtistJSONResponse[];
}

export interface IGetChartTopArtistsJSONResponse {
  artists: IGetChartTopArtistsArtistsJSONResponse;
}

// NORMALIZED




/* REQUEST */

export function getChartTopArtists(
  {
    page = 0,
    limit = 10,
  }: IGetChartTopArtistsOptions = {},
  signal?: AbortSignal,
): Promise<IGetChartTopArtistsJSONResponse> {
  const url: URL = forgeLastFMGetURL(`chart.getTopArtists`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  return fetchLastFMJSON<IGetChartTopArtistsJSONResponse>(url.href, { signal });
}

