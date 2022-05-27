import { bootstrap } from '@lirx/dom';
import { MatGrayBlockSkeletonComponent } from './mat-gray-block-skeleton.component';

/** BOOTSTRAP FUNCTION **/

export function matGrayBlockSkeletonExample() {
  const block = new MatGrayBlockSkeletonComponent();

  block.style.width = '400px';
  block.style.height = '100px';
  // block.classList.add('with-animation');

  bootstrap(block);
}
