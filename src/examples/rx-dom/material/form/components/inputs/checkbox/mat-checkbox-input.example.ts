import { MatCheckboxInputComponent } from './mat-checkbox-input.component';
import { bootstrap } from '@lirx/dom';

/** BOOTSTRAP FUNCTION **/

export function matCheckboxInputExample() {
  const input = new MatCheckboxInputComponent();
  bootstrap(input);

  // input.disabled = true;
}
