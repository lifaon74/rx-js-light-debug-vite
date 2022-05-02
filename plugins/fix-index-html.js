import * as $fs from 'fs/promises';
import * as $path from 'path';

const ROOT = $path.join($path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = $path.join(ROOT, 'dist');
const INDEX_FILE = $path.join(DIST, 'index.html');

async function run() {
  const content = await $fs.readFile(INDEX_FILE, { encoding: 'utf8' });

  const fixedContent = content.replace(/(src|href)="\/([^"]+)"/g, (match, type, path) => {
    return `${ type }="./${ path }"`;
  });

  // console.log(content);
  // console.log(fixedContent);

  await $fs.writeFile(INDEX_FILE, fixedContent);
}

run();
