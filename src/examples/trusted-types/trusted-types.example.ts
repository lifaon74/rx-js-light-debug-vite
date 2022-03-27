import DOMPurify from 'dompurify';
import { ISanitizeHTMLConfig, ISanitizeHTMLFunction } from './sanitite-html-function.type';
import { DEFAULT_SANITIZE_HTML_CONFIG } from './default-sanitize-html-config.constant';
import { HTMLTrustedTypePolicy } from './trusted-types.type';
import { createMulticastReplayLastSource, pipeObservable } from '@lifaon/rx-js-light';
import { sanitizeHTMLWithPolicyObservablePipe } from './pipes/sanitize-html-with-policy-observable-pipe';
import { sanitizeHTMLWithPolicyObservable } from './pipes/sanitize-html-with-policy-observable';


export function sanitizeHTML(
  html: string,
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): TrustedHTML {
  return DOMPurify.sanitize(html, config);
}


/*--*/

export function createHTMLSanitizerPolicy(
  name: string,
  config: ISanitizeHTMLConfig = DEFAULT_SANITIZE_HTML_CONFIG,
): HTMLTrustedTypePolicy {
  const sanitize: ISanitizeHTMLFunction = DOMPurify.sanitize;

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

function trustedTypesExample1() {
  // const dirty = '<img src=x onerror=alert(1)//>';
  // const dirty = '<svg><g/onload=alert(2)//<p>';
  // const dirty = '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>';
  // const dirty = '<math><mi//xlink:href="data:x,<script>alert(4)</script>">';
  // const dirty = '<TABLE><tr><td>HELLO</tr></TABL>';
  const dirty = '<UL><li><A HREF=//google.com>click</UL>';

  console.log(sanitizeHTML(dirty).toString());
  const sanitizer = createHTMLSanitizerPolicy('sanitize-using-dompurify');
  console.log(sanitizer.createHTML(dirty).toString());
}

function trustedTypesExample2() {
  const sanitizer = createHTMLSanitizerPolicy('sanitize-using-dompurify');

  const $dirty$ = createMulticastReplayLastSource<string>();

  const subscribe = sanitizeHTMLWithPolicyObservable($dirty$.subscribe, sanitizer);

  subscribe((safeHTML: TrustedHTML) => {
    document.body.innerHTML = safeHTML as unknown as string;
  });

  (window as any).html = $dirty$.emit;
}

/*--------------*/


export function trustedTypesExample() {
  // trustedTypesExample1();
  trustedTypesExample2();
}

