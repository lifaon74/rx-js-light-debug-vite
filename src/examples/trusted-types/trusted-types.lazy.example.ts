import { HTMLTrustedTypePolicy } from './trusted-types.type';
import { ISanitizeHTMLConfig, ISanitizeHTMLFunction } from './sanitite-html-function.type';
import { DEFAULT_SANITIZE_HTML_CONFIG } from './default-sanitize-html-config.constant';

// https://github.com/cure53/DOMPurify
// https://w3c.github.io/webappsec-trusted-types/dist/spec/#dictdef-trustedtypepolicyoptions


export async function getSanitizeHTMLFunction(): Promise<ISanitizeHTMLFunction> {
  const module: any = await import('dompurify');
  return module.default.sanitize as ISanitizeHTMLFunction;
}

/*--------*/

export async function sanitizeHTML(
  html: string,
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): Promise<TrustedHTML> {
  return (await getSanitizeHTMLFunction())(html, config);
}


/*--*/

export async function createHTMLSanitizerPolicy(
  name: string,
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): Promise<HTMLTrustedTypePolicy> {
  const sanitize: ISanitizeHTMLFunction = await getSanitizeHTMLFunction();

  if (window.trustedTypes === void 0) {
    return {
      name,
      createHTML(html: string): TrustedHTML {
        return sanitize(html, config);
      },
    };
  } else {
    return window.trustedTypes.createPolicy(name, {
      createHTML(html: string): string {
        return sanitize(html, config) as unknown as string;
      },
    });
  }
}


/*--------------*/


export async function trustedTypesLazyExample() {
  const dirty = '<img src=x onerror=alert(1)//>';

  // console.log(await sanitizeHTML(dirty));
  const sanitizer = await createHTMLSanitizerPolicy('sanitize-using-dompurify');
  console.log(sanitizer.createHTML(dirty));
}

