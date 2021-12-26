import { Component, defineSimpleObservableProperty } from '@lifaon/rx-dom';
import { createEventListener, IObservable, IObserver } from '@lifaon/rx-js-light';
import { resolveOptionalClickOrLinkTypeOnClick } from '../../click-or-link/shared/optional/resolve-optional-click-or-link-type-on-click';
import { NAVIGATION } from '../../navigation/navigation';


/** COMPONENT **/

@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElement {
  replaceState$!: IObservable<boolean>;
  readonly $replaceState!: IObserver<boolean>;
  replaceState!: boolean;

  constructor() {
    super();
    defineSimpleObservableProperty<boolean>(this, 'replaceState', false);

    createEventListener(this, 'click', (event: MouseEvent) => {
      resolveOptionalClickOrLinkTypeOnClick({
        clickOrLink: {
          type: 'link',
          url: new URL(this.href, this.baseURI),
          preventDefault: true,
        },
        event,
      });
      // if (
      //   (event.button === 0)
      //   && !event.ctrlKey
      //   && (this.target !== '_blank')
      //   && ['http:', 'https:'].includes(new URL(this.href, this.baseURI).protocol)
      // ) {
      //   event.preventDefault();
      //   NAVIGATION.navigate(this.href, {
      //     replaceState: this.replaceState,
      //   });
      // }
    });
  }
}
