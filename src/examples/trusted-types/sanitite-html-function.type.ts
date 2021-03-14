import type { Config } from 'dompurify';

export type ISanitizeHTMLConfig = Config & { RETURN_TRUSTED_TYPE: true };

export interface ISanitizeHTMLFunction {
  (html: string, config: ISanitizeHTMLConfig): TrustedHTML;
}
