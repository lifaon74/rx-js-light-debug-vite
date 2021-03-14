import { ISubscribePipeFunction, mapSubscribePipe } from '@lifaon/rx-js-light';
import { ISanitizeHTMLConfig } from '../sanitite-html-function.type';
import { DEFAULT_SANITIZE_HTML_CONFIG } from '../default-sanitize-html-config.constant';
import DOMPurify from 'dompurify';

export function sanitizeHTMLSubscribePipe(
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): ISubscribePipeFunction<string, TrustedHTML> {
  return mapSubscribePipe<string, TrustedHTML>((html: string) => DOMPurify.sanitize(html, config));
}
