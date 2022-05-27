import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, INJECT_CONTENT_TEMPLATE,
} from '@lirx/dom';
import { MatRippleComponent } from '../ripple/mat-ripple.component';
import { empty, map$$, single, timeout } from '@lirx/core';


// @ts-ignore
import html from './mat-button.component.html?raw';
// @ts-ignore
import style from './mat-button.component.scss?inline';

/**
 * COMPONENT: 'mat-button'
 */

@Component({
  name: 'mat-button',
  extends: 'button',
  // template: INJECT_CONTENT_TEMPLATE,
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatRippleComponent,
    ]
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatButtonComponent extends HTMLButtonElement {
  // onCreate(
  //   content: DocumentFragment,
  // ): any {
  //   // console.log(content);
  //   return {
  //     content$: map$$(timeout(100), () => content),
  //   };
  // }
}
