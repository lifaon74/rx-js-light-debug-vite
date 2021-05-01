import { MUSIC_BRAINZ_API_URL } from '../music-brainz-config.constant';

export interface IForgeMusicBrainzSearchURLOptions {
  entity: string;
  query: string;
  limit?: number;
  offset?: number;
}

export function forgeMusicBrainzSearchURL(
  {
    entity,
    query,
    limit = 10,
    offset = 0,
  }: IForgeMusicBrainzSearchURLOptions,
): URL {
  const url: URL = new URL(`${ MUSIC_BRAINZ_API_URL }${ entity }`);
  url.searchParams.set('fmt', 'json');
  url.searchParams.set('query', query);
  url.searchParams.set('method', 'advanced');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  return url;
}
