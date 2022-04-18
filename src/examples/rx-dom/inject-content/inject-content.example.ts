import { bootstrap } from '@lirx/dom';
import { AppInjectContentParentComponent } from './inject-content-parent.component';


/** BOOTSTRAP FUNCTION **/

export function injectContentExample() {
  bootstrap(new AppInjectContentParentComponent());
}
