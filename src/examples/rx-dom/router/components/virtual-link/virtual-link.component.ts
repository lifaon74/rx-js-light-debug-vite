import {
  Component, IHavingMultipleObservableProperties, setComponentMultipleObservableProperties
} from '@lifaon/rx-dom';
import { NAVIGATION } from '../../navigation/navigation';
import {
  createEventListener, IObservable, let$$, single
} from '@lifaon/rx-js-light';


/** COMPONENT **/

type IAppVirtualLinkComponentInputs = [
  ['replaceState', boolean],
];


@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElement implements IHavingMultipleObservableProperties<IAppVirtualLinkComponentInputs> {
  replaceState$!: IObservable<boolean>;
  replaceState!: boolean;

  constructor() {
    super();
    const $replaceState$ = let$$(single<boolean>(false));

    setComponentMultipleObservableProperties<this, IAppVirtualLinkComponentInputs>(this, [
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
