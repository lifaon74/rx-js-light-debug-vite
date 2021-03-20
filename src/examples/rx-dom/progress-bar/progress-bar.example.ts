import { bootstrap } from '@lifaon/rx-dom';
import { AppProgressBarComponent } from './progress-bar.component';
import { createProgressAnimation } from './create-progress-animation';

/** BOOTSTRAP FUNCTION **/

export function progressBarExample() {
  const progressBar = new AppProgressBarComponent();
  bootstrap(progressBar);

  progressBar.style.setProperty('--app-progress-bar-color', 'red');

  createProgressAnimation(progressBar);
}
