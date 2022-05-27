import { bootstrap } from '@lirx/dom';
import { MatSidenavContainerComponent } from './mat-sidenav-container.component';

/** BOOTSTRAP FUNCTION **/

export function matSidenavContainerExample() {
  const sidenav = new MatSidenavContainerComponent();
  bootstrap(sidenav);
}
