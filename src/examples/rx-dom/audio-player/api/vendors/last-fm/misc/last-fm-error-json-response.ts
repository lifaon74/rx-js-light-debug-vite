
export interface ILastFMErrorJSONResponse {
  error: number;
  links: string[];
  message: string;
}

export function isLastFMErrorJSONResponse(
  value: any,
): value is ILastFMErrorJSONResponse {
  return ('error' in value);
}


