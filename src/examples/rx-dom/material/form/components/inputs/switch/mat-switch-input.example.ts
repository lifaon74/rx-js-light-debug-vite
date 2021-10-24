import { MatSwitchInputComponent } from './mat-switch-input.component';
import { bootstrap } from '@lifaon/rx-dom';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';

/** BOOTSTRAP FUNCTION **/

export function matSwitchInputExample() {

  const input = new MatSwitchInputComponent();
  bootstrap(input);
}
