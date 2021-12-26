import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';

export interface IClickFunction {
  (event: MouseEvent): void;
}

export interface IClickType extends ILinkTypeEventOptions {
  type: 'click';
  onClick: IClickFunction;
}
