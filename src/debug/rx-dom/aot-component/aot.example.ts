import { AotComponent } from './aot.component';
import { bootstrap } from '@lirx/dom';

/** BOOTSTRAP FUNCTION **/

export function aotExample() {
  bootstrap(new AotComponent());
}
