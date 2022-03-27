import { HTMLTrustedTypePolicy } from '../trusted-types.type';
import { IObservable, IObservablePipe } from '@lifaon/rx-js-light';
import { sanitizeHTMLWithPolicyObservable } from './sanitize-html-with-policy-observable';

export function sanitizeHTMLWithPolicyObservablePipe(
  policy: HTMLTrustedTypePolicy,
): IObservablePipe<string, TrustedHTML> {
  return (subscribe: IObservable<string>): IObservable<TrustedHTML> => {
    return sanitizeHTMLWithPolicyObservable(subscribe, policy);
  };
}
