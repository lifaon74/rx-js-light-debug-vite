import { HTMLTrustedTypePolicy } from '../trusted-types.type';
import { IObservablePipe, mapObservablePipe } from '@lifaon/rx-js-light';

export function sanitizeHTMLWithPolicyObservablePipe(
  policy: HTMLTrustedTypePolicy,
): IObservablePipe<string, TrustedHTML> {
  return mapObservablePipe<string, TrustedHTML>((html: string) => policy.createHTML(html));
}
