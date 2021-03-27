import { createElement } from '@lifaon/rx-dom';

export function extractFileNameFromRequest(
  request: Request,
): string {
  const url: URL = new URL(request.url, window.origin);
  const parts: string[] = url.pathname.split('/');
  return parts[parts.length - 1];
}

export function extractFileNameFromResponse(
  response: Response,
): string {
  const url: URL = new URL(response.url, window.origin);
  const parts: string[] = url.pathname.split('/');
  return parts[parts.length - 1];
}

export function downloadBlob(
  blob: Blob,
  name: string = 'file.bin',
): void {
  const anchor: HTMLAnchorElement = createElement('a');
  const url: string = URL.createObjectURL(blob);
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}
