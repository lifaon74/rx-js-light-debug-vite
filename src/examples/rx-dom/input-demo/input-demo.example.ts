import { bootstrap } from '@lirx/dom';
import { AppInputDemoComponent } from './input-demo.component';
import { AppInputDemoUsingStoreComponent } from './input-demo-using-store.component';
import { AppInputDemoUsingProxyComponent } from './input-demo-using-proxy.component';


/** BOOTSTRAP FUNCTION **/

export function inputDemoExample() {
  // bootstrap(new AppInputDemoComponent());
  // bootstrap(new AppInputDemoUsingStoreComponent());
  bootstrap(new AppInputDemoUsingProxyComponent());
}
