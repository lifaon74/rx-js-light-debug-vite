import { bootstrap } from '@lirx/dom';
import { MatDualRingLoaderComponent } from './mat-dual-ring-loader.component';


/** BOOTSTRAP FUNCTION **/

export function matDualRingLoaderExample() {
  const loader = new MatDualRingLoaderComponent();
  bootstrap(loader);

}
