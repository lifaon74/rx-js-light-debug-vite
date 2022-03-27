import { HTMLTrustedTypePolicy } from '../trusted-types.type';
import { IObservable, mapObservable } from '@lifaon/rx-js-light';

export function sanitizeHTMLWithPolicyObservable(
  subscribe: IObservable<string>,
  policy: HTMLTrustedTypePolicy,
): IObservable<TrustedHTML> {
  return mapObservable<string, TrustedHTML>(subscribe, (html: string) => policy.createHTML(html));
}
