import { TrustedTypePolicy } from 'trusted-types';

export interface TrustedTypePolicyOptions {
  createHTML?: (input: string, ...args: any[]) => string;
  createScript?: (input: string, ...args: any[]) => string;
  createScriptURL?: (input: string, ...args: any[]) => string;
}

export type HTMLTrustedTypePolicyOptions = Required<Pick<TrustedTypePolicyOptions, 'createHTML'>>;

export type TrustedTypeCreatePolicyReturn<Options extends TrustedTypePolicyOptions> = Pick<TrustedTypePolicy<Options>, 'name' | Extract<keyof Options, keyof TrustedTypePolicyOptions>>;

export type HTMLTrustedTypePolicy = TrustedTypeCreatePolicyReturn<HTMLTrustedTypePolicyOptions>;


