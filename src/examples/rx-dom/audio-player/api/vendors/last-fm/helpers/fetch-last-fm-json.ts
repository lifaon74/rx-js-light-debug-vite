import { isLastFMErrorJSONResponse } from '../misc/last-fm-error-json-response';
import { createAPIError } from '../../../api-error/create-api-error';
import { fetchJSON } from '../../../helpers/fetch-json';

export function fetchLastFMJSON<GResult>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<GResult> {
  return fetchJSON<GResult>(input, init)
    .then((result: GResult): GResult => {
      if (isLastFMErrorJSONResponse(result)) {
        throw createAPIError({
          message: result.message,
          code: String(result.error),
        });
      } else {
        return result;
      }
    });
}
