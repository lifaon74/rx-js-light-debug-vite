import { bootstrap } from '@lifaon/rx-dom';
import { AppForLoopExampleComponent } from './for-loop-example.component';
import { AppForLoopExampleUsingStoreComponent } from './for-loop-example-using-store.component';


/** BOOTSTRAP FUNCTION **/

export function forLoopExample() {
  // bootstrap(new AppForLoopExampleComponent());
  bootstrap(new AppForLoopExampleUsingStoreComponent());
}
