import { Path } from '@lifaon/path';


export async function pathExample() {
  console.log(new Path('/').makeRelative().toString());
}
