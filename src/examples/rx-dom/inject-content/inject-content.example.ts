import { bootstrap } from '@lifaon/rx-dom';
import { AppInjectContentParentComponent } from './inject-content-parent.component';


/** BOOTSTRAP FUNCTION **/

export function injectContentExample() {
  bootstrap(new AppInjectContentParentComponent());
}
