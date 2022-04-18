// @ts-ignore
import style from './mat-modal.component.scss?inline';
import { MatOverlayManagerComponent } from '../../manager/mat-overlay-manager.component';
import { compileReactiveCSSAsComponentStyle, injectComponentStyle } from '@lirx/dom';
import { MatOverlayWithAnimationComponent } from '../../__component/with-animation/overlay-with-animation.component';
import { makeMatOverlayComponentBackdropClosable } from '../../__component/helpers/make-mat-overlay-component-backdrop-closable';

const componentStyle = compileReactiveCSSAsComponentStyle(style);

/** INTERFACE **/

export interface IMatModalComponentOptions {
  backdropClosable?: boolean;
}

/** COMPONENT **/

export class MatModalComponent extends MatOverlayWithAnimationComponent {
  constructor(
    manager: MatOverlayManagerComponent,
    {
      backdropClosable = true,
    }: IMatModalComponentOptions = {},
  ) {
    super(manager);

    injectComponentStyle(componentStyle, this);

    if (backdropClosable) {
      makeMatOverlayComponentBackdropClosable(this);
    }
  }
}

