import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, createDocumentFragment, getDocumentBody,
  loadReactiveHTMLAsComponentTemplate, nodeAppendChild,
  toReactiveContent, toReactiveContentObservable,
  trackByIdentity, transpileReactiveHTMLAsRawComponentTemplateFunctionWithImportsAsFirstArgumentToReactiveDOMJSLines,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './debug-reactive-dom-compiler-3.rxhtml?raw';
// @ts-ignore
import style from './debug-reactive-dom-compiler.scss?inline';
import { interval, let$$, letU$$, map$$, shareRL$$, single } from '@lifaon/rx-js-light';

async function fatHTMLGenerator(
  length: number = 1e3,
): Promise<void> {
  const lines: string[] = Array.from({ length }, (_, index: number): string => {
    return `<div>${index}</div>`;
  });

  await navigator.clipboard.writeText(lines.join('\n'));
}

async function debugReactiveDOMCompiler1() {

  // const template = await loadReactiveHTMLAsComponentTemplate({
  //   url: new URL('./debug-reactive-dom-compiler-3.rxhtml', import.meta.url),
  //   // customElements: [
  //   //   HTMLElement,
  //   //   HTMLAnchorElement,
  //   // ],
  //   modifiers: [
  //     {
  //       name: 'modifier',
  //       modify: (_: Element) => _,
  //     },
  //   ],
  // });

  // const template = compileReactiveHTMLAsComponentTemplate({ html: 'abc' });
  const template = compileReactiveHTMLAsComponentTemplate({ html });

  template(
    getDocumentBody(),
    {},
    null as any,
  );


  // requestAnimationFrame(() => {
  //   nodeAppendChild(getDocumentBody(),  template(createDocumentFragment(), {}, null as any));
  // });
}

// async function debugReactiveDOMCompiler2() {
//
//   // const template = await loadAndCompileReactiveCSSAsComponentStyle(
//   //   new URL('./debug-reactive-dom-compiler.rxhtml', import.meta.url)
//   // );
//
//   // const template = await compileReactiveCSSAsComponentStyle(style);
//   const template = await compileReactiveCSSAsComponentStyle(`
//     :host {
//       display: block;
//     }
//   `);
//
//   // const template = compileReactiveHTMLAsComponentTemplate({ html: 'abc' });
//   // const template = compileReactiveHTMLAsComponentTemplate({ html });
//
//   const result = template.innerText;
//
//   console.log(result);
// }
//
// // https://www.w3schools.com/graphics/svg_examples.asp
//
// async function debugReactiveDOMCompiler3() {
//
//   // document.body.innerHTML = `
//   //   <div color="red"></div>
//   //   <app-c color="red"></app-c>
//   //   <svg height="100" width="100">
//   //     <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
//   //   </svg>
//   // `;
//
//   const html = `abc`;
//   // const html = `{{ $.text }}`;
//   // const html = `a {{ $.text }} b`;
//   // const html = `<div color="red"></div>`;
//   // const html = `<svg height="100" width="100">
//   //   <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
//   // </svg>`;
//   // const html = `<div [title]="$.text">some content</div>`;
//   // const html = `<div [attr.id]="$.text"></div>`;
//   // const html = `<div [class.class-a]="$.bool"></div>`;
//   // const html = `<div [class...]="$.classes"></div>`;
//   // const html = `<div [style.font-size]="$.fontSize"></div>`;
//   // const html = `<div [style...]="$.style"></div>`;
//   // const html = `<div style="width: 500px; height: 500px; background-color: #fafafa" (click)="$.onClick"></div>`;
//
//   // const html = `
//   //   <rx-template
//   //     name="templateReference"
//   //     let-var1
//   //     let-var2
//   //   >
//   //     content
//   //   </rx-template>
//   // `;
//
//   // const html = `
//   //   <rx-template
//   //     name="templateReference"
//   //     let-text
//   //   >
//   //     {{ text }}
//   //   </rx-template>
//   //   <rx-inject-template
//   //     template="templateReference"
//   //     let-text="$.text"
//   //   ></rx-inject-template>
//   // `;
//
//   // const html = `
//   //   <rx-template name="templateReference">
//   //     <div>
//   //       I'm visible
//   //     </div>
//   //   </rx-template>
//   //
//   //   <button (click)="$.onClick">
//   //     toggle
//   //   </button>
//   //
//   //   <rx-if
//   //     condition="$.clickCondition"
//   //     true="templateReference"
//   //   ></rx-if>
//   // `;
//
//   // const html = `
//   //   <button (click)="$.onClick">
//   //     toggle
//   //   </button>
//   //   <div *if="$.clickCondition">
//   //     I'm visible
//   //   </div>
//   // `;
//
//   // const html = `
//   //   <rx-template
//   //     name="templateReference"
//   //     let-index="i"
//   //     let-item="value"
//   //   >
//   //     <div>
//   //      node #{{ i }} -> {{ value }}
//   //     </div>
//   //   </rx-template>
//   //   <rx-for-loop
//   //     items="$.items"
//   //     template="templateReference"
//   //     track-by="$.trackByFn"
//   //   ></rx-for-loop>
//   // `;
//
//   // const html = `
//   //   <div *for="let item of $.items; index as i; trackBy: $.trackByFn">
//   //     node #{{ i }} -> {{ item }}
//   //   </div>
//   // `;
//
//   // const html = `
//   //   <div
//   //     color="red"
//   //     [title]="$.text"
//   //     [attr.id]="$.text"
//   //     [class.class-a]="$.bool"
//   //     [class...]="$.classes"
//   //     [style.font-size]="$.fontSize"
//   //     [style...]="$.style"
//   //   >
//   //     a {{ $.text }} b
//   //   </div>
//   // `;
//
//   // const html = `
//   //   <rx-container *if="$.bool">
//   //     a {{ $.text }} b
//   //   </rx-container>
//   // `;
//
//   // const html = `
//   //   <rx-container *for="let item of $.items; index as i; trackBy: $.trackByFn">
//   //     node #{{ i }} -> {{ item }}<br>
//   //   </rx-container>
//   // `;
//
//   // const html = `
//   //   <rx-inject-content
//   //     content="$.content"
//   //   ></rx-inject-content>
//   // `;
//
//   // const html = `
//   //   <rx-template
//   //     name="templateReferenceA"
//   //   >
//   //     A
//   //   </rx-template>
//   //
//   //   <rx-template
//   //     name="templateReferenceB"
//   //   >
//   //     B
//   //   </rx-template>
//   //
//   //   <rx-template
//   //     name="templateReferenceC"
//   //   >
//   //     C
//   //   </rx-template>
//   //
//   //   <rx-switch
//   //     expression="$.switchValue"
//   //   >
//   //     <rx-switch-case
//   //       case="1"
//   //       template="templateReferenceA"
//   //     ></rx-switch-case>
//   //     <rx-switch-case
//   //       case="2"
//   //       template="templateReferenceB"
//   //     ></rx-switch-case>
//   //     <rx-switch-default
//   //       template="templateReferenceC"
//   //     ></rx-switch-default>
//   //   </rx-switch>
//   // `;
//
//
//   // const html = `
//   //   <rx-switch
//   //     expression="$.switchValue"
//   //   >
//   //     <div
//   //       *switch-case="1"
//   //     >
//   //       A
//   //     </div>
//   //    <div
//   //       *switch-case="2"
//   //     >
//   //       B
//   //     </div>
//   //     <div
//   //       *switch-default
//   //     >
//   //       C
//   //     </div>
//   //   </rx-switch>
//   // `;
//
//   // const url = `http://info.cern.ch/hypertext/WWW/TheProject.html`;
//   // const url = `https://streams.spec.whatwg.org/`;
//   // const url = `https://www.w3.org/TR/2021/WD-css-cascade-5-20210119/`;
//   // const html = await (await fetch(noCORS(url))).text();
//
//   // function $of<GValue>(value: GValue): IObservable<GValue> {
//   //   return pipeObservable(of<GValue>(value), [
//   //     sourceObservablePipe<GValue>(() => createUnicastReplayLastSource<GValue>()),
//   //   ]);
//   // }
//   //
//   const timer = shareRL$$(interval(1000));
//
//   const { emit: $click, subscribe: click$, getValue: clickState } = letU$$<boolean>();
//
//   const text = map$$(timer, () => String(Math.random()));
//
//   const data = {
//     text,
//     bool: map$$(timer, () => Math.random() < 0.5),
//     classes: single(['a', 'b']),
//     fontSize: map$$(timer, () => `${Math.random() * 20}px`),
//     style: single(new Map([['color', { value: 'red' }]])),
//     onClick: (event: MouseEvent) => {
//       console.log('click');
//       $click(!clickState());
//     },
//     clickCondition: click$,
//     items: single([1, 2, 3].map(single)),
//     trackByFn: trackByIdentity,
//     content: toReactiveContentObservable(text),
//     switchValue: single(3)
//   };
//
//   // type GData = typeof data;
//
//   const jsContent = transpileReactiveHTMLAsRawComponentTemplateFunctionWithImportsAsFirstArgumentToReactiveDOMJSLines(html).join('\n');
//   console.log(jsContent);
//
//   // const moduleContent = transpileReactiveHTMLAsComponentTemplateModuleToReactiveDOMJSLines(html).join('\n');
//   // console.log(moduleContent);
//
//   // const url: string = `data:application/javascript;base64,${btoa(moduleContent)}`;
//   // const mod = await import(url)
//   // console.log(mod);
//
//   const template = compileReactiveHTMLAsComponentTemplate({ html });
//   template(getDocumentBody(), data, null as any);
//
//   // console.time('compilation');
//   // const template = compileAndEvaluateReactiveHTMLAsComponentTemplate<GData>(html.trim());
//   // console.timeEnd('compilation');
//   // console.time('injection');
//   // const node = template(data);
//   // nodeAppendChild(document.body, node);
//   // console.timeEnd('injection');
//
//   // console.time('html-injection');
//   // document.body.innerHTML = html;
//   // console.timeEnd('html-injection');
//
//   /**
//    * The raw compiled minified version is around 2 times bigger than the html, and the gzipped version 10% bigger.
//    * The compilation of 250K of html takes approximately 200ms (~1250B/ms = 1.25MB/s)
//    * The injection of 250K of html takes approximately 80ms
//    *
//    * @example:  https://www.w3.org/TR/2021/WD-css-cascade-5-20210119/ (250K of html, 43.5k gzipped)
//    *
//    * compilation: 195.925048828125 ms
//    * minification: 2807.080078125 ms
//    * - html: 240325
//    * - compiled: 2287049 (html: 951%)
//    * - minified: 423652 (html: 176%, compiled: 18%) => 48.6K gzipped
//    * injection: 79.2978515625 ms
//    *
//    * aot compilation:
//    * - +10% size, but insignificant excess download time (mostly due to awaiting server instead of download time)
//    * - wins compiler size and compilation time
//    * - potentially less performant if user has a connection lower than 1.25Mb/s (125KB/s) (10% of 1.25MB/s - compile time)
//    */
//   // const componentCode: string = await compileReactiveHTMLAsModuleWithStats(html);
//   // navigator.clipboard.writeText(componentCode);
//   // const dataURL: string = `data:application/javascript;base64,${ btoa(unescape(encodeURIComponent(componentCode))) }`;
//   // const module = await import(dataURL);
//   // const template = wrapHTMLTemplateForComponentTemplate(module.default, DEFAULT_CONSTANTS_TO_IMPORT);
//   // console.time('injection');
//   // const node = template(data);
//   // nodeAppendChild(document.body, node);
//   // console.timeEnd('injection');
// }


/*----*/


export async function debugReactiveDOMCompiler() {
  // fatHTMLGenerator(5e4);
  await debugReactiveDOMCompiler1();
  // await debugReactiveDOMCompiler2();
  // await debugReactiveDOMCompiler3();
}
