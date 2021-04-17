import { Component } from '@lifaon/rx-dom';
import { NAVIGATION } from '../../navigation/navigation';
import { createEventListener } from '@lifaon/rx-js-light';


/** COMPONENT **/


@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElement {
  constructor() {
    super();
    createEventListener(this, 'click', (event: MouseEvent) => {

      if (
        (event.button === 0)
        && !event.ctrlKey
        && (this.target !== '_blank')
        && ['http:', 'https:'].includes(new URL(this.href, this.baseURI).protocol)
      ) {
        event.preventDefault();
        NAVIGATION.navigate(this.href);
      }
    });
  }
}
