import { IReadonlyEmailAddress } from './email-address.type';

export function emailAddressToString(
  {
    username,
    hostname,
  }: IReadonlyEmailAddress,
): string {
  return `${username}@${hostname}`;
}
