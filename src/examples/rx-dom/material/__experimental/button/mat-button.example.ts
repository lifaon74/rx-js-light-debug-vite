import { MatButtonComponent } from './mat-button.component';
import { bootstrap } from '@lifaon/rx-dom';

/** BOOTSTRAP FUNCTION **/

export function matButtonExample() {
  const component = new MatButtonComponent();
  bootstrap(component);
}
