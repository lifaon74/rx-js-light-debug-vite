import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, nodeAppendChild, nodeRemove,
  querySelectorOrThrow,
} from '@lirx/dom';
import { fromEventTarget } from '@lirx/core';

// @ts-ignore
import html from './mat-ripple.component.html?raw';
// @ts-ignore
import style from './mat-ripple.component.scss?inline';
import { createRippleFromElementAndPointerEvent } from './functions/create-ripple-from-element-and-pointer-event';


/**
 * COMPONENT: 'mat-ripple'
 */

@Component({
  name: 'mat-ripple',
  // template: INJECT_CONTENT_TEMPLATE,
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatRippleComponent extends HTMLElement {
  constructor() {
    super();

    const onPointerDown = (event: PointerEvent): void => {
      const ripplesContainerElement: HTMLDivElement = querySelectorOrThrow<HTMLDivElement>(this, ':scope > .ripples-container');

      const color: string = getComputedStyle(this).getPropertyValue('--mat-ripple-color');

      const {
        element,
        open,
        close,
      } = createRippleFromElementAndPointerEvent({
        element: this,
        event,
        color: (color === '')
          ? 'rgba(0, 0, 0, 0.05)'
          : color,
      });

      nodeAppendChild(ripplesContainerElement, element);

      const pointerUp$ = fromEventTarget(window, 'pointerup');

      const unsubscribePointerUp = pointerUp$(() => {
        unsubscribePointerUp();
        openPromise.then(() => {
          return close()
            .then(() => {
              nodeRemove(element);
            });
        });
      });

      const openPromise = open();
    };

    const pointerDown$ = fromEventTarget<'pointerdown', PointerEvent>(this, 'pointerdown');

    pointerDown$(onPointerDown);

    // setReactiveEventListener(onPointerDown, this, 'pointerdown');
  }
}
