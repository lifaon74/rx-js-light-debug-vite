import { IArtist } from '../../../interfaces';
import {
  createVirtualLinkedLisGetItemFunctionFromPaginationFunction, IPageInfo, IPaginatedData, IVirtualLinkedListIterator,
  virtualLinkedListGetItemFunctionIterator
} from '../../../async-list';
import { forgeLastFMGetURL } from '../helpers/forge-last-fm-get-url';
import { fetchLastFMJSON } from '../helpers/fetch-last-fm-json';

/** SEARCH ARTIST **/

/* REQUEST */

// QUERY PARAMS

export interface ISearchArtistQueryParams {
  page?: number | string;
  limit?: number | string;
  artist: string;
}

// NORMALIZED

export interface ISearchArtistOptions extends IPageInfo {
  artist: string;
}

// export interface ISearchArtistOptions extends IPageInfo {
//   artist: string;
// }

/* RESPONSE */

// JSON


export interface ISearchArtistResultsAttrJSONResponse {
  for: string;
}

export interface ISearchArtistResultsOpenSearchQueryJSONResponse {
  '#text': string;
  role: string;
  searchTerms: string;
  startPage: string;
}

export interface ISearchArtistResultsArtistMatchesArtistJSONResponse {
  // TODO image
  // image: [{#text: "https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png",…},…]
  listeners: string;
  mbid: string;
  name: string;
  streamable: string;
  url: string;
}

export interface ISearchArtistResultsArtistMatchesJSONResponse {
  artist: ISearchArtistResultsArtistMatchesArtistJSONResponse[];
}

export interface ISearchArtistResultsJSONResponse {
  '@attr': ISearchArtistResultsAttrJSONResponse;
  artistmatches: ISearchArtistResultsArtistMatchesJSONResponse;

  // page
  'opensearch:Query': ISearchArtistResultsOpenSearchQueryJSONResponse;
  'opensearch:itemsPerPage': string;
  'opensearch:startIndex': string;
  'opensearch:totalResults': string;
}

export interface ISearchArtistJSONResponse {
  results: ISearchArtistResultsJSONResponse;
}

// NORMALIZED


/* REQUEST */

export function searchArtistRaw(
  options: ISearchArtistQueryParams,
  signal?: AbortSignal,
): Promise<ISearchArtistJSONResponse> {
  const url: URL = forgeLastFMGetURL(`artist.search`);

  url.searchParams.set('artist', options.artist);

  if (options.page !== void 0) {
    url.searchParams.set('page', String(options.page));
  }

  if (options.limit !== void 0) {
    url.searchParams.set('limit', String(options.limit));
  }

  return fetchLastFMJSON<ISearchArtistJSONResponse>(url.href, { signal });
}

export function searchArtist(
  options: ISearchArtistOptions,
  signal?: AbortSignal,
): Promise<IPaginatedData<IArtist>> {
  return searchArtistRaw({
    page: (options.pageIndex + 1),
    limit: options.itemsPerPage,
    artist: options.artist,
  }, signal)
    .then((result: ISearchArtistJSONResponse): IPaginatedData<IArtist> => {
      return {
        itemsCount: parseInt(result.results['opensearch:totalResults'], 10),
        itemsPerPage: parseInt(result.results['opensearch:itemsPerPage'], 10),
        data: result.results.artistmatches.artist.map((artist: ISearchArtistResultsArtistMatchesArtistJSONResponse): IArtist => {
          return {
            name: artist.name,
            id: artist.mbid,
          }
        }),
        pageIndex: parseInt(result.results['opensearch:Query'].startPage, 10) - 1,
      };
    });
}

export function searchArtistIterator(
  artist: string,
  signal?: AbortSignal,
): IVirtualLinkedListIterator<IArtist> {
  return virtualLinkedListGetItemFunctionIterator<IArtist>(
    createVirtualLinkedLisGetItemFunctionFromPaginationFunction<IArtist>(
      (
        page: IPageInfo,
        signal?: AbortSignal,
      ) => {
        return searchArtist({ ...page, artist }, signal);
      }
    ),
    'last',
    signal,
  );
}



