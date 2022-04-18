import { bootstrap } from '@lirx/dom';
import { MatProgressBarComponent } from './mat-progress-bar.component';
import { createProgressAnimation } from './misc/create-progress-animation';

/** BOOTSTRAP FUNCTION **/

export function matProgressBarExample() {
  const progressBar = new MatProgressBarComponent();
  bootstrap(progressBar);

  // progressBar.classList.add('with-animation');
  progressBar.style.setProperty('--mat-progress-bar-color', '#755d9a');

  createProgressAnimation(progressBar);
}
