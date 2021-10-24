import {
  createMulticastReplayLastSource, createUnicastReplayLastSource, expression, interval, ISubscribeFunction, of,
  pipeSubscribeFunction, sourceSubscribePipe,
} from '@lifaon/rx-js-light';
import {
  compileReactiveHTMLAsGenericComponentTemplate, getDocumentBody, nodeAppendChild,
  transpileReactiveHTMLAsComponentTemplateFunctionToReactiveDOMJSLines, loadReactiveHTMLAsGenericComponentTemplate,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './debug-reactive-dom-compiler.rxhtml?raw';

// async function rxDOMCompilerTextExample() {
//   const html = `abc`;
//
//   const js = transpileReactiveHTMLAsComponentTemplateFunctionToReactiveDOMJSLines(html);
//   const template = compileReactiveHTMLAsGenericComponentTemplate({ html });
//   // console.log(js.join('\n'));
//
//   const result = template({
//     data: {},
//     content: null as any,
//     getNodeReference: null as any,
//     setNodeReference: null as any,
//     getTemplateReference: null as any,
//     setTemplateReference: null as any,
//   });
//
//   console.log(result);
// }


async function debugReactiveDOMCompiler1() {

  const template = await loadReactiveHTMLAsGenericComponentTemplate({
    url: new URL('./debug-reactive-dom-compiler.rxhtml', import.meta.url),
    customElements: [
      HTMLElement,
      HTMLAnchorElement,
    ],
    modifiers: [
      {
        name: 'modifier',
        modify: _ => _,
      },
    ],
  });

  // const template = compileReactiveHTMLAsGenericComponentTemplate({ html: 'abc' });
  // const template = compileReactiveHTMLAsGenericComponentTemplate({ html });

  const result = template({
    data: {},
    content: null as any,
    getNodeReference: null as any,
    setNodeReference: null as any,
    getTemplateReference: null as any,
    setTemplateReference: null as any,
  });

  nodeAppendChild(getDocumentBody(), result);
}

// async function debugReactiveDOMCompiler1() {
//
//   // const html = `abc`;
//   // const html = `{{ $.text }}`;
//   // const html = `a {{ $.text }} b`;
//   // const html = `<div color="red"></div>`;
//   // const html = `<div [title]="$.title">some content</div>`;
//   // const html = `<div [attr.id]="$.id"></div>`;
//   // const html = `<div [class.class-a]="$.classA"></div>`;
//   // const html = `<div [class...]="$.classes"></div>`;
//   // const html = `<div [style.font-size]="$.fontSize"></div>`;
//   // const html = `<div [style...]="$.style"></div>`;
//   // const html = `<div style="width: 500px; height: 500px; background-color: #fafafa" (click)="$.onClick"></div>`;
//   const html = `<div #nodeA></div>`;
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
//   //   <rx-inject-static-template
//   //     template="templateReference"
//   //     let-text="$.text"
//   //   ></rx-inject-static-template>
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
//   //     [title]="$.title"
//   //     [attr.id]="$.id"
//   //     [class.class-a]="$.classA"
//   //     [class...]="$.classes"
//   //     [style.font-size]="$.fontSize"
//   //     [style...]="$.style"
//   //   >
//   //     a {{ $.text }} b
//   //   </div>
//   // `;
//
//   // const html = `
//   //   <rx-container *if="$.condition">
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
//   function $of<GValue>(value: GValue): ISubscribeFunction<GValue> {
//     return pipeSubscribeFunction(of<GValue>(value), [
//       sourceSubscribePipe<GValue>(() => createUnicastReplayLastSource<GValue>()),
//     ]);
//   }
//
//   const timer = interval(1000);
//
//   const clickSource = createMulticastReplayLastSource<boolean>();
//
//   const data = {
//     title: $of('my-title'),
//     id: expression(() => Math.random(), timer),
//     classA: expression(() => Math.random() < 0.5, timer),
//     classes: $of(['a', 'b']),
//     fontSize: expression(() => Math.floor(Math.random() * 20) + 'px', timer),
//     style: $of({ color: 'red' }),
//     text: expression(() => new Date().toString(), timer),
//     onClick: (event: MouseEvent) => {
//       console.log('click');
//       clickSource.emit(!clickSource.getValue());
//     },
//     condition: expression(() => Math.random() < 0.5, timer),
//     items: $of([1, 2, 3].map($of)),
//     trackByFn: (_: any) => _,
//     clickCondition: clickSource.subscribe,
//     // content: $of(compileAndEvaluateReactiveHTMLAsComponentTemplate(`
//     //   hello world
//     // `, {})({
//     //   data: {},
//     //   content: createDocumentFragment(),
//     // })),
//     switchValue: $of(3)
//   };
//
//   type GData = typeof data;
//
//   // console.log(compileHTMLAsHTMLTemplate(html).join('\n'));
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
//

/*----*/


export async function debugReactiveDOMCompiler() {
  // await rxDOMCompilerTextExample();
  await debugReactiveDOMCompiler1();
  // await debugReactiveDOMCompiler1();
}
