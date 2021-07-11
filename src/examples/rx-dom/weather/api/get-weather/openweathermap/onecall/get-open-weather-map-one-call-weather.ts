import { fetchJSON } from '../../../helpers/fetch-json';
import { API_KEY } from '../../../config';
import { IGetOpenWeatherMapOneCallWeatherJSONResponse } from './response.type';
import { IGetOpenWeatherMapOneCallWeatherOptions } from './request.type';

/**
 * DOC: https://openweathermap.org/api/one-call-api
 */


export function getOpenWeatherMapOneCallWeather(
  {
    latitude,
    longitude,
    exclude = [],
    units,
    // exclude = ['alerts', 'minutely'],
    // units = 'metric',
    lang,
  }: IGetOpenWeatherMapOneCallWeatherOptions,
  signal?: AbortSignal,
): Promise<IGetOpenWeatherMapOneCallWeatherJSONResponse> {
  const url: URL = new URL(`https://api.openweathermap.org/data/2.5/onecall`);

  url.searchParams.set('appid', API_KEY);

  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));

  if (exclude.length > 0) {
    url.searchParams.set('exclude', exclude.join(','));
  }

  if (units !== void 0) {
    url.searchParams.set('units', units);
  }

  if (lang !== void 0) {
    url.searchParams.set('lang', lang);
  }

  return fetchJSON<IGetOpenWeatherMapOneCallWeatherJSONResponse>(
    url.href,
    { signal },
  );
}


