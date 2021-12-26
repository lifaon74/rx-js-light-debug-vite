import { ILinkTypeEventOptions } from './link-type-event-options.type';

export const LINK_TYPE_NO_PREVENT: ILinkTypeEventOptions = {
  preventDefault: false,
};

export const LINK_TYPE_NO_STOP_PROPAGATION: ILinkTypeEventOptions = {
  stopImmediatePropagation: false,
  stopPropagation: false,
};

export const LINK_TYPE_NO_PREVENT_AND_NO_STOP_PROPAGATION: ILinkTypeEventOptions = {
  ...LINK_TYPE_NO_PREVENT,
  ...LINK_TYPE_NO_STOP_PROPAGATION,
};
