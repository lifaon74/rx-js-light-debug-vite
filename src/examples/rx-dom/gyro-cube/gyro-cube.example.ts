import { bootstrap } from '@lifaon/rx-dom';
import { GyroCubeComponent } from './component/gyro-cube.component';

export function gyroCubeExample() {
  bootstrap(new GyroCubeComponent());
}
