import { IObservablePipe, mapObservablePipe } from '@lirx/core';
import { ISanitizeHTMLConfig } from '../sanitite-html-function.type';
import { DEFAULT_SANITIZE_HTML_CONFIG } from '../default-sanitize-html-config.constant';
import DOMPurify from 'dompurify';

export function sanitizeHTMLObservablePipe(
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): IObservablePipe<string, TrustedHTML> {
  return mapObservablePipe<string, TrustedHTML>((html: string) => DOMPurify.sanitize(html, config));
}
