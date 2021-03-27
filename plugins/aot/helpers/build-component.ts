import puppeteer from 'puppeteer';
// import * as puppeteer from 'puppeteer/lib/esm/puppeteer/node-puppeteer-core';
// @ts-ignore
import btoa from 'btoa';
// const btoa = require('btoa');
// const puppeteer = require('puppeteer');
import { promises as $fs } from 'fs';
import * as $path from 'path';
import { fileURLToPath } from 'url';

// https://github.com/acornjs/acorn
// https://pptr.dev/
// https://rollupjs.org/guide/en/
// https://vitejs.dev/guide/api-plugin.html#conventions

/**
 * Problems:
 * - constantsToImport cannot be known until we evaluate the component
 */
export async function buildComponent() {


  const templateString = `
    <div class="input-container">
      <input
        #input
        [value]="$.input.subscribe"
        (input)="() => $.input.emit(input.value)"
      >
    </div>
    <div
      class="max-length-container"
      [class.valid]="$.valid"
    >
      Length: {{ $.remaining }} / 10
    </div>
  `;


  const js = await $fs.readFile($path.join($path.dirname(fileURLToPath(import.meta.url)), 'compiler.bundled.js'), { encoding: 'utf8' });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Debug</title>
        <script>
          ${ js }
          
          globalThis.compilerResult = compiler.compile(${ JSON.stringify(templateString) });
        </script>
      </head>
      <body>
        hello world
      </body>
    </html>
  `;

  const url = `data:text/html;base64,${btoa(html)}`
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url);
  // await page.goto(`https://www.google.com`);
  const compilerResult = await page.evaluate(() => {
    return (globalThis as any).compilerResult;
  });

  console.log(compilerResult);

  // await page.screenshot({ path: 'example.png' });
  // await browser.close();
}

