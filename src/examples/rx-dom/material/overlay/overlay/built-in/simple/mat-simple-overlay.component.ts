// @ts-ignore
import style from './mat-simple-overlay.component.scss?inline';
import { MatOverlayManagerComponent } from '../../manager/mat-overlay-manager.component';
import { compileReactiveCSSAsComponentStyle, injectComponentStyle, subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { combineLatest, ISubscribeFunction } from '@lifaon/rx-js-light';
import { MatOverlayWithAnimationComponent } from '../../component/with-animation/overlay-with-animation.component';
import { findDOMElement } from '../../../../../../misc/find-dom-element';
import { ICSSPositionAndSize } from '../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { applyCSSPositionAndSize } from '../../../../../../misc/types/position-and-size/apply-css-position-and-size';

const componentStyle = compileReactiveCSSAsComponentStyle(style);

/** FUNCTIONS **/


/** INTERFACE **/


export interface IMatSimpleOverlayComponentOptions {
}

/** COMPONENT **/

export class MatSimpleOverlayComponent extends MatOverlayWithAnimationComponent {
  constructor(
    manager: MatOverlayManagerComponent,
    positionAndSize$: ISubscribeFunction<ICSSPositionAndSize>,
    {
    }: IMatSimpleOverlayComponentOptions = {},
  ) {
    super(manager);

    injectComponentStyle(componentStyle, this);

    subscribeOnNodeConnectedTo(
      this,
      combineLatest([findDOMElement(`:scope > .content`, this), positionAndSize$]),
      ([
         element,
         positionAndSize,
       ]) => {
        applyCSSPositionAndSize(element, positionAndSize);
      },
    );
  }
}

