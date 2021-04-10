import { bootstrap } from '@lifaon/rx-dom';
import { AppForLoopExampleComponent } from './for-loop-example.component';


/** BOOTSTRAP FUNCTION **/

export function forLoopExample() {
  // helloWorldDebug();
  bootstrap(new AppForLoopExampleComponent());
}
