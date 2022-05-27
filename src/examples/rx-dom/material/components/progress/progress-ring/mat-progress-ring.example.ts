import { bootstrap } from '@lirx/dom';
import { MatProgressRingComponent } from './mat-progress-ring.component';
import { createProgressAnimation } from '../progress-bar/misc/create-progress-animation';


/** BOOTSTRAP FUNCTION **/

export function matProgressRingExample() {
  // progressRingDebug();

  const progressRing = new MatProgressRingComponent();
  bootstrap(progressRing);

  progressRing.progress = 0.75;
  progressRing.radius = 100;
  progressRing.stroke = 20;

  // progressRing.style.setProperty('--app-progress-ring-color', 'red');

  createProgressAnimation(progressRing);

  (window as any).progressRing = progressRing;
}
