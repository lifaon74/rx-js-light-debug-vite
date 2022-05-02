import * as $fs from 'fs/promises';
import * as $path from 'path';

const ROOT_PATH = $path.join($path.dirname(new URL(import.meta.url).pathname), '..');
const NODE_MODULE_PATH = $path.join(ROOT_PATH, 'node_modules');
const VITE_CACHE_PATH = $path.join(NODE_MODULE_PATH, '.vite');
const LIRX_DOM_CACHE_PATH = $path.join(NODE_MODULE_PATH, '.lirx/dom-cache');

async function run(
  {
    clearViteCache,
    clearLirxDOMCache,
  },
) {
  if (clearViteCache) {
    await $fs.rm(VITE_CACHE_PATH, { recursive: true, force: true });
  }
  if (clearLirxDOMCache) {
    await $fs.rm(LIRX_DOM_CACHE_PATH, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);

const options =  {
  clearViteCache: args.includes('--vite'),
  clearLirxDOMCache: args.includes('--lirx-dom'),
};

run(options);

