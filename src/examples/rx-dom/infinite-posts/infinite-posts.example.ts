import { bootstrap } from '@lirx/dom';
import { AppTilesListComponent } from './tiles-list/tiles-list.component';


/** BOOTSTRAP FUNCTION **/

export function infinitePostsExample() {
  bootstrap(new AppTilesListComponent());
}
