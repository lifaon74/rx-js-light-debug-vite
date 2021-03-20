import { bootstrap, setAttributeValueWithEvent } from '@lifaon/rx-dom';


export async function progressBarLazyExample() {
  const { AppProgressBarComponent } = await import('./progress-bar.component');
  const progressBar = new AppProgressBarComponent();
  bootstrap(progressBar);

  progressBar.progress = 0.5;
}
