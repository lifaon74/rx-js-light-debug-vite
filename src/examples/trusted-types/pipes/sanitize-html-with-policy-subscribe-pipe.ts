import { HTMLTrustedTypePolicy } from '../trusted-types.type';
import { ISubscribePipeFunction, mapSubscribePipe } from '@lifaon/rx-js-light';

export function sanitizeHTMLWithPolicySubscribePipe(
  policy: HTMLTrustedTypePolicy,
): ISubscribePipeFunction<string, TrustedHTML> {
  return mapSubscribePipe<string, TrustedHTML>((html: string) => policy.createHTML(html));
}
