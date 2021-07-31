import { MatIconComponent } from './mat-icon.component';
import { bootstrap, createStyleElement, getDocumentHead, nodeAppendChild } from '@lifaon/rx-dom';

/** BOOTSTRAP FUNCTION **/

export function matIconExample() {
  const component = new MatIconComponent();
  bootstrap(component);

  component.title = 'abc';
  component.name = 'icon-playback-pause';
  component.style.setProperty('--mat-icon-size-inner', '40px');
}
