import { bootstrap } from '@lifaon/rx-dom';
import {
  AppGenericRangeInputComponent, IGenericRangeInputOption, IGenericRangeInputOptionsList,
} from './generic-range-input.component';
import { single } from '@lifaon/rx-js-light';
import { MatOverlayManagerComponent } from '../../../material/overlay/overlay/manager/mat-overlay-manager.component';

/** BOOTSTRAP FUNCTION **/

export function genericRangeInputExample() {
  const element = new AppGenericRangeInputComponent();
  bootstrap(element);

  /*---*/

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);

  /*---*/

  type GValue = number;


  const options: IGenericRangeInputOptionsList<GValue> = Array.from({ length: 10 }, (_, index: number): IGenericRangeInputOption<GValue> => {
    return {
      label$: single(`options-${index}`),
      value: index,
    }
  });

  element.options = options;
}
