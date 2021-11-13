import { bootstrap } from '@lifaon/rx-dom';
import { MatGrayBlockSkeletonComponent } from './mat-gray-block-skeleton.component';

/** BOOTSTRAP FUNCTION **/

export function matGrayBlockSkeletonExample() {
  const block = new MatGrayBlockSkeletonComponent();
  bootstrap(block);
}
