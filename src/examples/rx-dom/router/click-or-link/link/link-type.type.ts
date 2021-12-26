import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';
import { INavigationNavigateOptions } from '../../navigation/navigation';
import { IStringOrURL } from '@lifaon/rx-dom';

export interface ILinkType extends ILinkTypeEventOptions, INavigationNavigateOptions {
  type: 'link';
  url: IStringOrURL;
}
