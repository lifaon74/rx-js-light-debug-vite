import { bootstrap } from '@lirx/dom';
import { AppFilesListComponent } from './components/files-list/files-list.component';


/** BOOTSTRAP FUNCTION **/

export async function fileSystemExample() {

  bootstrap(new AppFilesListComponent());
}

