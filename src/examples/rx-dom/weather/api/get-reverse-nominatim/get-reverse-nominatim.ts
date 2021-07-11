import { fetchJSON } from '../helpers/fetch-json';
import { IGetReverseNominatimOptions } from './request.type';
import { IGetReverseNominatimJSONResponse } from './response.type';


export function getReverseNominatim(
  {
    latitude,
    longitude,
  }: IGetReverseNominatimOptions,
  signal?: AbortSignal,
): Promise<IGetReverseNominatimJSONResponse> {
  // https://openweathermap.org/api/geocoding-api
  const url: URL = new URL(`https://nominatim.openstreetmap.org/reverse`);

  url.searchParams.set('format', 'json');

  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));

  return fetchJSON<IGetReverseNominatimJSONResponse>(
    url.href,
    { signal },
  );
}


export function getReverseNominatimCached(
  options?: IGetReverseNominatimOptions,
  signal?: AbortSignal,
): Promise<IGetReverseNominatimJSONResponse> {
  return Promise.resolve(
    {
      'place_id': 306827010,
      'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
      'osm_type': 'way',
      'osm_id': 913499650,
      'lat': '46.18655875',
      'lon': '6.127468122639173',
      'display_name': 'Esplanade 3, 3, Esplanade de Pont-Rouge, Petit-Lancy, Lancy, Grand Genève, Geneva, 1212, Switzerland',
      'address': {
        'building': 'Esplanade 3',
        'house_number': '3',
        'road': 'Esplanade de Pont-Rouge',
        'suburb': 'Petit-Lancy',
        'town': 'Lancy',
        'municipality': 'Grand Genève',
        'state': 'Geneva',
        'postcode': '1212',
        'country': 'Switzerland',
        'country_code': 'ch'
      },
      'boundingbox': ['46.1863082', '46.186804', '6.1270788', '6.1277358']
    }
  );
}

