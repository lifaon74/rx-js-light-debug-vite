import {
  bootstrap, compileReactiveCSSAsComponentStyle, Component, getDocument, IReactiveContent, nodeAppendChild, nodeRemove,
  querySelectorOrThrow,
} from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-overlay-manager.component.scss?inline';

/** INTERFACES **/

interface IOverlay {
  readonly component: HTMLElement;
  readonly content$: IReactiveContent;
}

interface IData {
  readonly overlays$: IObservable<readonly IOverlay[]>;
}

/** COMPONENT **/

@Component({
  name: 'mat-overlay-manager',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatOverlayManagerComponent extends HTMLElement {

  static init(): void {
    queueMicrotask(() => {
      this.bootstrap();
    });
  }

  static bootstrap(): MatOverlayManagerComponent {
    try {
      return this.getInstance();
    } catch (error) {
      const manager = new this();
      bootstrap(manager);
      return manager;
    }
  }

  static getInstance(): MatOverlayManagerComponent {
    return querySelectorOrThrow(getDocument(), 'mat-overlay-manager');
  }

  static open<GElement extends HTMLElement>(
    element: GElement,
  ): GElement {
    return this.getInstance().open<GElement>(element);
  }

  static close(
    element: HTMLElement,
  ): void {
    return this.getInstance().close(element);
  }

  static has(
    element: HTMLElement,
  ): boolean {
    return this.getInstance().has(element);
  }


  constructor() {
    super();
  }

  open<GElement extends HTMLElement>(
    element: GElement,
  ): GElement {
    if (element.parentNode === null) {
      return nodeAppendChild(this, element);
    } else {
      throw new Error(`The overlay must be detached from any parents`);
    }
  }

  close(
    element: HTMLElement,
  ): void {
    if (this.has(element)) {
      nodeRemove(element);
    } else {
      throw new Error(`Not an overlay of this manager`);
    }
  }

  has(
    element: HTMLElement,
  ): boolean {
    return (element.parentNode === this);
  }
}

