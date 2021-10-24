import { AotComponent } from './aot.component';
import { bootstrap } from '@lifaon/rx-dom';

/** BOOTSTRAP FUNCTION **/

export function aotExample() {
  bootstrap(new AotComponent());
}
