import { MatCheckboxInputComponent } from './mat-checkbox-input.component';
import { bootstrap } from '@lifaon/rx-dom';

/** BOOTSTRAP FUNCTION **/

export function matCheckboxInputExample() {

  const input = new MatCheckboxInputComponent();
  bootstrap(input);
}