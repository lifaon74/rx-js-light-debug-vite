import { MatIconComponent } from './mat-icon.component';
import { bootstrap } from '@lirx/dom';

/** BOOTSTRAP FUNCTION **/

export function matIconExample() {
  const component = new MatIconComponent();
  bootstrap(component);

  component.title = 'abc';
  // component.name = 'icon-playback-pause';
  component.name = 'icon-mat-search';
  component.style.setProperty('color', 'red');
  component.style.setProperty('--mat-icon-size-inner', '40px');
}
