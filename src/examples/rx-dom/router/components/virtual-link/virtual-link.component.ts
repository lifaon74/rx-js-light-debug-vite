import {
  Component, IHavingMultipleSubscribeFunctionProperties, setComponentMultipleSubscribeFunctionProperties
} from '@lifaon/rx-dom';
import { NAVIGATION } from '../../navigation/navigation';
import {
  createEventListener, ISubscribeFunction
} from '@lifaon/rx-js-light';
import { single$$, let$$ } from '@lifaon/rx-js-light-shortcuts';


/** COMPONENT **/

type IAppVirtualLinkComponentInputs = [
  ['replaceState', boolean],
];


@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElement implements IHavingMultipleSubscribeFunctionProperties<IAppVirtualLinkComponentInputs> {
  replaceState$!: ISubscribeFunction<boolean>;
  replaceState!: boolean;

  constructor() {
    super();
    const $replaceState$ = let$$(single$$<boolean>(false));

    setComponentMultipleSubscribeFunctionProperties<this, IAppVirtualLinkComponentInputs>(this, [
      ['replaceState', $replaceState$],
    ]);

    createEventListener(this, 'click', (event: MouseEvent) => {
      if (
        (event.button === 0)
        && !event.ctrlKey
        && (this.target !== '_blank')
        && ['http:', 'https:'].includes(new URL(this.href, this.baseURI).protocol)
      ) {
        event.preventDefault();
        NAVIGATION.navigate(this.href, this.replaceState);
      }
    });
  }
}
