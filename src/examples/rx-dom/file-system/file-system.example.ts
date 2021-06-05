import { bootstrap } from '@lifaon/rx-dom';
import { AppFilesListComponent } from './components/files-list/files-list.component';


/** BOOTSTRAP FUNCTION **/

export async function fileSystemExample() {

  bootstrap(new AppFilesListComponent());
}

