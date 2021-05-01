import { LST_FM_API_KEY, LAST_FM_API_URL } from '../last-fm-config.constant';

export function forgeLastFMGetURL(
  method: string,
): URL {
  const url: URL = new URL(LAST_FM_API_URL);
  url.searchParams.set('method', method);
  url.searchParams.set('api_key', LST_FM_API_KEY);
  url.searchParams.set('format', 'json');
  return url;
}
