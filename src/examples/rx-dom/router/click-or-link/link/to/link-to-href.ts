import { ILinkType } from '../link-type.type';
import { stringOrURLToString } from '@lifaon/rx-dom';

export function linkToHREF(
  {
    url,
  }: ILinkType,
): string {
  return stringOrURLToString(url);
}

