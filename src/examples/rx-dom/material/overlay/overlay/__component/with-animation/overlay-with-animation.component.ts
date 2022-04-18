import { MatOverlayComponent, IOverlayCloseOrigin } from '../mat-overlay.component';
import { MatOverlayManagerComponent } from '../../manager/mat-overlay-manager.component';
import { createAnimationFrame, createTimeout } from '@lirx/core';
import { getElementTransitionDuration } from '../../../../../../misc/css/quantities/time/__old/get-element-transition-duration';
import { findDOMElement } from '../../../../../../misc/find-dom-element';


/** FUNCTIONS **/

function awaitTransitionEnd(
  node: Element,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: void) => void,
  ): void => {
    const time: number | null = getElementTransitionDuration(node);
    if (time === null) {
      resolve();
    } else {
      createTimeout(resolve, time);
    }
  });
}

function openMatOverlayWithAnimationComponent(
  node: MatOverlayWithAnimationComponent,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: Promise<void>) => void,
  ): void => {
    createAnimationFrame(() => {
      resolve(awaitTransitionEnd(node));
      node.classList.add('visible');
    });
  });
}

function closeMatOverlayWithAnimationComponent(
  node: MatOverlayWithAnimationComponent,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: Promise<void>) => void,
  ): void => {
    createAnimationFrame(() => {
      resolve(awaitTransitionEnd(node));
      node.classList.remove('visible');
    });
  });
}


/** COMPONENT **/

export class MatOverlayWithAnimationComponent extends MatOverlayComponent {
  private readonly _openPromise: Promise<void>;
  private _closePromise: Promise<void> | undefined;

  constructor(
    manager: MatOverlayManagerComponent,
  ) {
    super(manager);
    this._openPromise = openMatOverlayWithAnimationComponent(this);
  }

  override close(origin?: IOverlayCloseOrigin): Promise<void> {
    if (this._closePromise === void 0) {
      if (this._openPromise === void 0) {
        super.close(origin);
        this._closePromise = Promise.resolve();
      } else {
        this._closePromise = this._openPromise
          .then(() => {
            return closeMatOverlayWithAnimationComponent(this);
          })
          .then(() => {
            super.close(origin);
          });
      }
    }
    return this._closePromise;
  }
}

