import { bootstrap } from '@lifaon/rx-dom';
import { AppProgressRingComponent } from './progress-ring.component';
import { createProgressAnimation } from '../progress-bar/create-progress-animation';


/** BOOTSTRAP FUNCTION **/

export async function progressRingLazyExample() {
  const { AppProgressRingComponent } = await import('./progress-ring.component');

  const progressRing = new AppProgressRingComponent();
  bootstrap(progressRing);

  progressRing.progress = 0.75;
  progressRing.radius = 100;
  progressRing.stroke = 20;

  // progressRing.style.setProperty('--app-progress-ring-color', 'red');

  createProgressAnimation(progressRing);

  (window as any).progressRing = progressRing;
}
