import { ISanitizeHTMLConfig } from './sanitite-html-function.type';

export const DEFAULT_SANITIZE_HTML_CONFIG: ISanitizeHTMLConfig = {
  RETURN_TRUSTED_TYPE: true,
  USE_PROFILES: {
    html: true,
  },
};

