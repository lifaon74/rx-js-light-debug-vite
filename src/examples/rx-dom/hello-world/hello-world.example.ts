import { bootstrap } from '@lifaon/rx-dom';
import { AppHelloWorldComponent } from './hello-world.component';


/** BOOTSTRAP FUNCTION **/

export function helloWorldExample() {
  bootstrap(new AppHelloWorldComponent());
}
