import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';
import { IClickFunction, IClickType } from './click-type.type';


export function clickType(
  onClick: IClickFunction,
  extraOptions?: ILinkTypeEventOptions,
): IClickType {
  return {
    type: 'click',
    onClick,
    ...extraOptions,
  };
}
