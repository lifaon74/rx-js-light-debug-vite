import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';
import { ILinkType } from './link-type.type';

export function linkType(
  href: string,
  extraOptions?: ILinkTypeEventOptions,
): ILinkType {
  return {
    type: 'link',
    url: href,
    ...extraOptions,
  };
}
