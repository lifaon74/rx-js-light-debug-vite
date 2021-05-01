
export function fetchJSON<GResult>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<GResult> {
  return fetch(input, init)
    .then((response: Response) => response.json());
}
