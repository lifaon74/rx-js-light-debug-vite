import { MatSelectInputComponent } from './mat-select-input.component';
import { bootstrap } from '@lirx/dom';
import { single } from '@lirx/core';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IMatSelectInputOption } from './types/mat-select-input-option.type';

/** BOOTSTRAP FUNCTION **/

export function matSelectInputExample() {
  /* MAT SELECT INPUT */

  const input = new MatSelectInputComponent();
  bootstrap(input);

  /* INIT OVERLAY */

  MatOverlayManagerComponent.init();


  /* PROPERTIES */

  const options = Array.from({ length: 10 }, (v: any, index: number): IMatSelectInputOption<number> => {
    return {
      label$: single(`options-${ index }`),
      value: index,
    };
  });

  input.rawOptions = options;

  input.multiple = true;
  input.rawSelectedOptions = [options[0], options[1]];
}
