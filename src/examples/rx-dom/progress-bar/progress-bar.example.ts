import { bootstrap, setAttributeValueWithEvent } from '@lifaon/rx-dom';
import { AppProgressBarComponent } from './progress-bar.component';


/** BOOTSTRAP FUNCTION **/

export function progressBarExample() {
  const progressBar = new AppProgressBarComponent();
  bootstrap(progressBar);

  progressBar.style.setProperty('--app-progress-bar-color', 'red');

  const loop = () => {
    // setAttributeValue(progressBar, 'ratio', '1');
    // progressBar.ratio = (progressBar.ratio + 0.1) % 1;
    progressBar.ratio = (progressBar.ratio + 0.01 * Math.random()) % 1;
    // setAttributeValueWithEvent(progressBar, 'ratio', String((progressBar.ratio + 0.01 * Math.random()) % 1));
    setTimeout(loop, 100);
  }
  loop();

  // setAttributeValueWithEvent(progressBar, 'ratio', '1');
}
