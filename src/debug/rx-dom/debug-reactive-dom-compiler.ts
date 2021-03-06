import {
  asyncUnsubscribe, conditionalSubscribePipe, createLocalesSource, createMulticastReplayLastSource,
  createSubscribeFunctionProxy, createUnicastReplayLastSource, dateTimeShortcutFormatSubscribePipe, expression,
  fromFetch, fromMatchMedia, fromPromise, IDateTimeFormatValue, IDateTimeShortcutFormat, IDefaultNotificationsUnion,
  IMulticastReplayLastSource, interval, ISubscribeFunction, ISubscribeFunctionFromFetchNotifications,
  ISubscribeFunctionProxy, ISubscribePipeFunction, IUnicastReplayLastSource, mapSubscribePipe,
  mergeMapSubscribePipeWithNotifications, mergeWithNotifications, numberFormatSubscribePipe, of, pipeSubscribeFunction,
  reactiveFunction, sourceSubscribePipe,
} from '@lifaon/rx-js-light';
import {
  attachNode, bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, compileHTMLAsHTMLTemplate,
  compileReactiveCSSAsComponentStyle, Component, createElementModifier, createElementNode, createNodeModifier,
  DEFAULT_CONSTANTS_TO_IMPORT,
  DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT, generateGetNodeModifierFunctionFromArray, getDocumentBody, nodeAppendChild,
  OnConnect, OnCreate, OnDisconnect, uuid,
} from '@lifaon/rx-dom';
import { AppWindowComponent } from './window-component/window.component';
import { noCORS } from '../../examples/misc/no-cors';
import { eq$$ } from '@lifaon/rx-js-light-shortcuts';

const buttonStyle = `
  min-width: 100px;
  height: 40px;
  font-size: 16px;
  color: black;
  background-color: white;
  border: 1px solid black;
`;

const inputStyle = `
  min-width: 100px;
  height: 40px;
  font-size: 16px;
  color: black;
  background-color: white;
  border: 1px solid black;
`;

async function debugReactiveDOMCompiler1() {

  // const html = `abc`;
  // const html = `{{ $.text }}`;
  // const html = `a {{ $.text }} b`;
  // const html = `<div color="red"></div>`;
  // const html = `<div [title]="$.title">some content</div>`;
  // const html = `<div [attr.id]="$.id"></div>`;
  // const html = `<div [class.class-a]="$.classA"></div>`;
  // const html = `<div [class...]="$.classes"></div>`;
  // const html = `<div [style.font-size]="$.fontSize"></div>`;
  // const html = `<div [style...]="$.style"></div>`;
  // const html = `<div style="width: 500px; height: 500px; background-color: #fafafa" (click)="$.onClick"></div>`;
  const html = `<div #nodeA></div>`;

  // const html = `
  //   <rx-template
  //     name="templateReference"
  //     let-var1
  //     let-var2
  //   >
  //     content
  //   </rx-template>
  // `;

  // const html = `
  //   <rx-template
  //     name="templateReference"
  //     let-text
  //   >
  //     {{ text }}
  //   </rx-template>
  //   <rx-inject-static-template
  //     template="templateReference"
  //     let-text="$.text"
  //   ></rx-inject-static-template>
  // `;

  // const html = `
  //   <rx-template name="templateReference">
  //     <div>
  //       I'm visible
  //     </div>
  //   </rx-template>
  //
  //   <button (click)="$.onClick">
  //     toggle
  //   </button>
  //
  //   <rx-if
  //     condition="$.clickCondition"
  //     true="templateReference"
  //   ></rx-if>
  // `;

  // const html = `
  //   <button (click)="$.onClick">
  //     toggle
  //   </button>
  //   <div *if="$.clickCondition">
  //     I'm visible
  //   </div>
  // `;

  // const html = `
  //   <rx-template
  //     name="templateReference"
  //     let-index="i"
  //     let-item="value"
  //   >
  //     <div>
  //      node #{{ i }} -> {{ value }}
  //     </div>
  //   </rx-template>
  //   <rx-for-loop
  //     items="$.items"
  //     template="templateReference"
  //     track-by="$.trackByFn"
  //   ></rx-for-loop>
  // `;

  // const html = `
  //   <div *for="let item of $.items; index as i; trackBy: $.trackByFn">
  //     node #{{ i }} -> {{ item }}
  //   </div>
  // `;

  // const html = `
  //   <div
  //     color="red"
  //     [title]="$.title"
  //     [attr.id]="$.id"
  //     [class.class-a]="$.classA"
  //     [class...]="$.classes"
  //     [style.font-size]="$.fontSize"
  //     [style...]="$.style"
  //   >
  //     a {{ $.text }} b
  //   </div>
  // `;

  // const html = `
  //   <rx-container *if="$.condition">
  //     a {{ $.text }} b
  //   </rx-container>
  // `;

  // const html = `
  //   <rx-container *for="let item of $.items; index as i; trackBy: $.trackByFn">
  //     node #{{ i }} -> {{ item }}<br>
  //   </rx-container>
  // `;

  // const html = `
  //   <rx-inject-content
  //     content="$.content"
  //   ></rx-inject-content>
  // `;

  // const html = `
  //   <rx-template
  //     name="templateReferenceA"
  //   >
  //     A
  //   </rx-template>
  //
  //   <rx-template
  //     name="templateReferenceB"
  //   >
  //     B
  //   </rx-template>
  //
  //   <rx-template
  //     name="templateReferenceC"
  //   >
  //     C
  //   </rx-template>
  //
  //   <rx-switch
  //     expression="$.switchValue"
  //   >
  //     <rx-switch-case
  //       case="1"
  //       template="templateReferenceA"
  //     ></rx-switch-case>
  //     <rx-switch-case
  //       case="2"
  //       template="templateReferenceB"
  //     ></rx-switch-case>
  //     <rx-switch-default
  //       template="templateReferenceC"
  //     ></rx-switch-default>
  //   </rx-switch>
  // `;


  // const html = `
  //   <rx-switch
  //     expression="$.switchValue"
  //   >
  //     <div
  //       *switch-case="1"
  //     >
  //       A
  //     </div>
  //    <div
  //       *switch-case="2"
  //     >
  //       B
  //     </div>
  //     <div
  //       *switch-default
  //     >
  //       C
  //     </div>
  //   </rx-switch>
  // `;

  // const url = `http://info.cern.ch/hypertext/WWW/TheProject.html`;
  // const url = `https://streams.spec.whatwg.org/`;
  // const url = `https://www.w3.org/TR/2021/WD-css-cascade-5-20210119/`;
  // const html = await (await fetch(noCORS(url))).text();

  function $of<GValue>(value: GValue): ISubscribeFunction<GValue> {
    return pipeSubscribeFunction(of<GValue>(value), [
      sourceSubscribePipe<GValue>(() => createUnicastReplayLastSource<GValue>()),
    ]);
  }

  const timer = interval(1000);

  const clickSource = createMulticastReplayLastSource<boolean>();

  const data = {
    title: $of('my-title'),
    id: expression(() => Math.random(), timer),
    classA: expression(() => Math.random() < 0.5, timer),
    classes: $of(['a', 'b']),
    fontSize: expression(() => Math.floor(Math.random() * 20) + 'px', timer),
    style: $of({ color: 'red' }),
    text: expression(() => new Date().toString(), timer),
    onClick: (event: MouseEvent) => {
      console.log('click');
      clickSource.emit(!clickSource.getValue());
    },
    condition: expression(() => Math.random() < 0.5, timer),
    items: $of([1, 2, 3].map($of)),
    trackByFn: (_: any) => _,
    clickCondition: clickSource.subscribe,
    // content: $of(compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    //   hello world
    // `, {})({
    //   data: {},
    //   content: createDocumentFragment(),
    // })),
    switchValue: $of(3)
  };

  type GData = typeof data;

  console.log(compileHTMLAsHTMLTemplate(html).join('\n'));

  // console.time('compilation');
  // const template = compileAndEvaluateReactiveHTMLAsComponentTemplate<GData>(html.trim());
  // console.timeEnd('compilation');
  // console.time('injection');
  // const node = template(data);
  // nodeAppendChild(document.body, node);
  // console.timeEnd('injection');

  // console.time('html-injection');
  // document.body.innerHTML = html;
  // console.timeEnd('html-injection');

  /**
   * The raw compiled minified version is around 2 times bigger than the html, and the gzipped version 10% bigger.
   * The compilation of 250K of html takes approximately 200ms (~1250B/ms = 1.25MB/s)
   * The injection of 250K of html takes approximately 80ms
   *
   * @example:  https://www.w3.org/TR/2021/WD-css-cascade-5-20210119/ (250K of html, 43.5k gzipped)
   *
   * compilation: 195.925048828125 ms
   * minification: 2807.080078125 ms
   * - html: 240325
   * - compiled: 2287049 (html: 951%)
   * - minified: 423652 (html: 176%, compiled: 18%) => 48.6K gzipped
   * injection: 79.2978515625 ms
   *
   * aot compilation:
   * - +10% size, but insignificant excess download time (mostly due to awaiting server instead of download time)
   * - wins compiler size and compilation time
   * - potentially less performant if user has a connection lower than 1.25Mb/s (125KB/s) (10% of 1.25MB/s - compile time)
   */
  // const componentCode: string = await compileReactiveHTMLAsModuleWithStats(html);
  // navigator.clipboard.writeText(componentCode);
  // const dataURL: string = `data:application/javascript;base64,${ btoa(unescape(encodeURIComponent(componentCode))) }`;
  // const module = await import(dataURL);
  // const template = wrapHTMLTemplateForComponentTemplate(module.default, DEFAULT_CONSTANTS_TO_IMPORT);
  // console.time('injection');
  // const node = template(data);
  // nodeAppendChild(document.body, node);
  // console.timeEnd('injection');
}


async function debugReactiveDOMCompiler2() {

  const locales = createLocalesSource();


  const inputValue = createMulticastReplayLastSource<string>();

  const inputValueAsNumber = pipeSubscribeFunction(inputValue.subscribe, [
    mapSubscribePipe<string, number>(Number),
  ]);

  const isInvalid = reactiveFunction(
    [inputValueAsNumber],
    (value: number): boolean => {
      return Number.isNaN(value);
    },
  );

  const currencyText = pipeSubscribeFunction(inputValueAsNumber, [
    numberFormatSubscribePipe(locales.subscribe, of({
      style: 'currency',
      currency: 'eur',
    }))
  ]);


  const data = {
    onInputChange(input: HTMLInputElement): void {
      inputValue.emit(input.value);
    },
    inputValue,
    isInvalid,
    currencyText,
    locales,
  };

  const html = `
    <style>
      input {
        border: 1px solid black;
        outline: none;
      }
      input.invalid {
        border-color: red !important;
      }
    </style>
    <input
      #input
      [value]="$.inputValue.subscribe"
      (input)="() => $.onInputChange(input)"
      [class.invalid]="$.isInvalid"
    />
    <div>
      {{ $.currencyText }}
    </div>
    <button (click)="() => $.locales.emit($.locales.getValue().includes('fr') ? 'en' : 'fr')">
      swap locale
    </button>
  `;

  // nodeAppendChild(document.body, compileAndEvaluateReactiveHTMLAsComponentTemplate(html.trim(), DEFAULT_CONSTANTS_TO_IMPORT)(data, createDocumentFragment()));

  // const module = compileHTMLAsModule(html).join('\n');
  // console.log(await minify(module));
}


async function debugReactiveDOMCompiler3() {

  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
    ...DEFAULT_CONSTANTS_TO_IMPORT,
  };

  const $locales$ = createLocalesSource();

  function setUpAppDateComponent() {
    interface IData {
      date: ISubscribeFunction<string>;
    }

    @Component({
      name: 'app-date',
      template: compileAndEvaluateReactiveHTMLAsComponentTemplate<IData>(`
        {{ $.date }}
      `,
        CONSTANTS_TO_IMPORT
      ),
      style: compileReactiveCSSAsComponentStyle(`
        :host {
          display: inline-block;
        }
      `)
    })
    class AppDateComponent extends HTMLElement implements OnCreate<IData> {
      protected readonly data: IData;
      protected _dateSource: IUnicastReplayLastSource<any>;

      get date(): IDateTimeFormatValue {
        return this._dateSource.getValue();
      }

      set date(value: IDateTimeFormatValue) {
        this._dateSource.emit(value);
      }

      constructor() {
        super();

        this._dateSource = createUnicastReplayLastSource<number>();

        this.data = {
          date: pipeSubscribeFunction(this._dateSource.subscribe, [
            dateTimeShortcutFormatSubscribePipe($locales$.subscribe, of<IDateTimeShortcutFormat>('medium')),
          ]),
        };
      }

      onCreate(): any {
        return this.data;
      }
    }
  }

  function setUpAppMainComponent() {
    interface IData {
      time: ISubscribeFunction<number>;
      count: IMulticastReplayLastSource<number>;

      onClickButton(): void;
    }

    @Component({
      name: 'app-main',
      template: compileAndEvaluateReactiveHTMLAsComponentTemplate<IData>(`
        <div>
          <app-date [date]="$.time"></app-date>
        </div>
        <button
          (click)="$.onClickButton"
        >
          {{ $.count.subscribe }}
        </button>
      `,
        CONSTANTS_TO_IMPORT,
      ),
      style: compileReactiveCSSAsComponentStyle(`
        button:focus { outline: 0; }
      
        :host {
          display: block;
        }
        
        :host > button {
          min-width: 100px;
          height: 40px;
          font-size: 16px;
          color: black;
          background-color: white;
          border: 1px solid black;
        }
      `)
    })
    class AppMainComponent extends HTMLElement implements OnCreate<IData>, OnConnect, OnDisconnect {
      protected readonly data: IData;

      constructor() {
        super();

        this.data = {
          time: pipeSubscribeFunction(interval(1000), [
            mapSubscribePipe<void, number>(() => Date.now()),
          ]),
          count: createMulticastReplayLastSource<number>({ initialValue: 0 }),
          onClickButton: () => {
            this.data.count.emit(this.data.count.getValue() + 1);
          }
        };
      }

      onCreate(): any {
        return this.data;
      }

      onConnect(): void {
        console.log('connected');
      }

      onDisconnect(): void {
        console.log('disconnected');
      }
    }
  }


  setUpAppDateComponent();
  setUpAppMainComponent();

  nodeAppendChild(document.body, createElementNode('app-main'));
}


async function debugReactiveDOMCompiler4() {

  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
    ...DEFAULT_CONSTANTS_TO_IMPORT,
  };

  function setUpAppMainComponent() {
    interface IData {
      inputValue: IMulticastReplayLastSource<string>;
      tasks: IMulticastReplayLastSource<string[]>;
      noTasks: ISubscribeFunction<boolean>;

      onInputChange(event: Event): void;

      onSubmitForm(event: Event): void;

      onClickRemoveTask(index: ISubscribeFunction<number>): void;
    }

    @Component({
      name: 'app-main',
      template: compileAndEvaluateReactiveHTMLAsComponentTemplate<IData>(`
        <form
          (submit)="$.onSubmitForm"
        >
          <input
            type="text"
            [value]="$.inputValue.subscribe"
            (input)="$.onInputChange"
          />
          <button
            class="add-task"
            type="submit"
          >
            Add Task
          </button>
        </form>
        
        <div class="no-tasks" *if="$.noTasks">
<!--        <div class="no-tasks" *if="pipe($.tasks.subscribe, [map(_ => _.length === 0)])">-->
<!--        <div class="no-tasks" *if="func(_ => _.length === 0, [$.tasks.subscribe])">-->
          No tasks
        </div>
        
        <ul *if="not($.noTasks)">
          <li class="task" *for="let task of $.tasks.subscribe; index as index">
            <span
              class="remove-icon"
              (click)="() => $.onClickRemoveTask(index)"
            >???</span>
            <span>{{ of(task) }}</span>
          </li>
        </ul>
        
      `,
        CONSTANTS_TO_IMPORT,
      ),
      style: compileReactiveCSSAsComponentStyle(`
        button:focus { outline: 0; }
        input:focus { outline: 0; }
        * {
           box-sizing: border-box;
        }
        
        :host {
          display: block;
          padding: 20px;
        }
        
        :host button {
          ${ buttonStyle }
        }
        
        :host input {
          ${ inputStyle }
        }
        
        :host .no-tasks {
          padding: 20px;
        }
        
        :host .task > * {
          display: inline-block;
          vertical-align: top;
          line-height: 14px;
          font-size: 14px;
        }
        
        :host .remove-icon {
          user-select: none;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          cursor: pointer;
        }
      `)
    })
    class AppMainComponent extends HTMLElement implements OnCreate<IData> {
      protected readonly data: IData;

      constructor() {
        super();
        const tasks = createMulticastReplayLastSource<string[]>({ initialValue: [] });

        this.data = {
          inputValue: createMulticastReplayLastSource<string>({ initialValue: '' }),
          tasks,
          noTasks: pipeSubscribeFunction(tasks.subscribe, [
            mapSubscribePipe<string[], boolean>((tasks: string[]) => (tasks.length === 0)),
          ]),

          onInputChange: (event: Event) => {
            this.data.inputValue.emit((event.target as HTMLInputElement).value);
          },

          onSubmitForm: (event: Event) => {
            event.preventDefault();
            const value: string = this.data.inputValue.getValue().trim();
            if (value.length !== 0) {
              this.data.tasks.emit(this.data.tasks.getValue().concat([value]));
              this.data.inputValue.emit('');
            }
          },

          onClickRemoveTask: (index: ISubscribeFunction<number>) => {
            const unsubscribe = index((index: number) => {
              asyncUnsubscribe(() => unsubscribe);
              const tasks: string[] = this.data.tasks.getValue();
              tasks.splice(index, 1);
              this.data.tasks.emit(tasks);
            });
          },
        };
      }

      onCreate(): any {
        return this.data;
      }
    }
  }


  setUpAppMainComponent();

  nodeAppendChild(document.body, createElementNode('app-main'));
}


/** PROXY **/
async function debugReactiveDOMCompiler5() {

  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
    ...DEFAULT_CONSTANTS_TO_IMPORT,
  };

  function setUpAppMainComponent() {

    interface IProxyData {
      name: string;
      email: string;
      // items: string[];
      items: { id: string }[];
    }

    interface IData {
      data: IMulticastReplayLastSource<IProxyData>;
      proxy: ISubscribeFunctionProxy<IProxyData>;
    }

    @Component({
      name: 'app-main',
      template: compileAndEvaluateReactiveHTMLAsComponentTemplate<IData>(`
        <div>{{ $.proxy.name.$ }}</div>
        <div>{{ $.proxy.email.$ }}</div>
        <div>{{ $.proxy.items.length.$ }}</div>
<!--        <div *for="let item of $.proxy.items.$">-->
<!--          {{ of(item) }}-->
<!--        </div>-->
        <div *for="let item of $.proxy.items.$array">
          <span>{{ item.id.$ }}</span>
        </div>
      `,
        CONSTANTS_TO_IMPORT,
      ),
    })
    class AppMainComponent extends HTMLElement implements OnCreate<IData> {
      protected readonly data: IData;

      constructor() {
        super();
        const _data: IProxyData = {
          name: 'Spongebob',
          email: 'a@b.c',
          items: [],
        };
        const data = createMulticastReplayLastSource<IProxyData>({ initialValue: _data });

        this.data = {
          data,
          proxy: createSubscribeFunctionProxy<IProxyData>(data.subscribe)
        };

        // setInterval(() => {
        //   const _data = data.getValue();
        //   data.emit({
        //     ..._data,
        //     // items: _data.items.concat([uuid()])
        //     items: _data.items.concat([{ id: uuid() }])
        //   });
        // }, 1000);

        setInterval(() => {
          const _data = data.getValue();
          _data.items[Math.floor(_data.items.length * Math.random())].id = uuid();
          data.emit(_data);
        }, 1000);

        _data.items = Array.from({ length: 1e2 }, (v: any, i: number) => ({ id: `id-${ i }` }));

        (window as any).$data$ = data;

      }

      onCreate(): any {
        return this.data;
      }
    }
  }


  setUpAppMainComponent();

  nodeAppendChild(document.body, createElementNode('app-main'));
}

/** NODE MODIFIER **/
async function debugReactiveDOMCompiler6() {

  const tooltipModifier = createElementModifier('tooltip', (element: HTMLElement, value: string): HTMLElement => {
    element.title = value;
    return element;
  });


  /*---*/

  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_CONSTANTS_TO_IMPORT,
    getNodeModifier: generateGetNodeModifierFunctionFromArray([
      tooltipModifier,
    ]),
  };

  @Component({
    name: 'app-main',
    template: compileAndEvaluateReactiveHTMLAsComponentTemplate<any>(`
        <div $tooltip="['hello world !']">
          some content
        </div>
      `,
      CONSTANTS_TO_IMPORT,
    ),
  })
  class AppMainComponent extends HTMLElement {
    constructor() {
      super();
    }
  }

  bootstrap(new AppMainComponent());
}

/**
 * Lazy loaded images - wip
 */
async function debugReactiveDOMCompiler7() {

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source

  type IResourceNotification = IDefaultNotificationsUnion<Blob>;
  type IResourceLoader = ISubscribeFunction<IResourceNotification>;

  function parallelResourcesLoader(
    resources: readonly IResourceLoader[],
  ): IResourceLoader {
    return mergeWithNotifications(resources, { errorOnFirstError: false, completeOnFirstComplete: true });
  }

  function httpResourceLoader(
    src: string,
  ): IResourceLoader {
    return pipeSubscribeFunction(fromFetch(src), [
      mergeMapSubscribePipeWithNotifications<ISubscribeFunctionFromFetchNotifications, Blob>((response: Response) => fromPromise(response.blob()))
    ]);
  }

  function imageLoader(
    src: string,
  ): IResourceLoader {
    return httpResourceLoader(src);
  }

  // INFO stopped there
  function matchesMedia<GValue>(
    query: string,
  ): ISubscribePipeFunction<GValue, GValue> {
    return conditionalSubscribePipe<GValue>(fromMatchMedia(query));
  }

  // function supportsType(
  //   src: string,
  // ): IResourceLoader {
  //   return httpResourceLoader(src);
  // }


  @Component({
    name: 'app-image',
  })
  class AppImageComponent extends HTMLElement {
    public readonly load: IResourceLoader;

    constructor(
      loader: IResourceLoader,
    ) {
      super();
      this.load = loader;
    }
  }


  const img = new AppImageComponent(parallelResourcesLoader([
    pipeSubscribeFunction(imageLoader(noCORS('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/Sample-image10-highres.jpg')), [
      matchesMedia<IResourceNotification>('(max-width: 600px)'),
    ]),
    // imageLoader(noCORS('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/sample_07_0.jpg')),
    // imageLoader(noCORS('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/Sample%202_0.jpg')),
  ]));


  img.load((value: any) => {
    console.log(value);
  });

  // nodeAppendChild(document.body, img);

  fromMatchMedia('(max-width: 600px)')((value: boolean) => {
    console.log('changed', value);
  });
  //
  // fromResizeObserver(document.body)((value: ResizeObserverEntry) => {
  //   console.log('resized', value);
  // });
}

// async function debugReactiveDOMCompiler7() {
//
//   interface IOptionsWithAbortSignal {
//     signal?: AbortSignal;
//   }
//
//   interface IResourceLoader<GOptions extends IOptionsWithAbortSignal = IOptionsWithAbortSignal> {
//     (options?: GOptions): Promise<Blob>;
//   }
//
//   // class ResourcesLoader {
//   //   protected _resources: readonly IResourceLoader[];
//   //
//   //   constructor(
//   //     resources?: Iterable<IResourceLoader>,
//   //   ) {
//   //     this._resources = [];
//   //     if (resources !== void 0) {
//   //       this.setResources(resources)
//   //     }
//   //   }
//   //
//   //   getResources(): readonly IResourceLoader[] {
//   //     return this._resources;
//   //   }
//   //
//   //   setResources(resources: Iterable<IResourceLoader>): void {
//   //     this._resources = Array.from(resources);
//   //   }
//   //
//   //   load(options?: IOptionsWithAbortSignal): Promise<Blob> {
//   //     return this._resources.reduce<Promise<Blob>>((promise: Promise<Blob>, resourceLoader: IResourceLoader): Promise<Blob> => {
//   //       return promise.catch(wrapFunctionWithOptionalAbortSignalAndThrow(() => {
//   //         return resourceLoader(options);
//   //       }, options?.signal))
//   //     }, Promise.reject(new Error(`No ressources`)));
//   //   }
//   // }
//
//   function sequentialResourcesLoader(
//     resources: Pick<IResourceLoader[], 'reduce'>,
//   ): IResourceLoader {
//     return (options?: IOptionsWithAbortSignal): Promise<Blob> => {
//       return resources.reduce<Promise<Blob>>((promise: Promise<Blob>, resourceLoader: IResourceLoader): Promise<Blob> => {
//         return promise.catch(wrapFunctionWithOptionalAbortSignalAndThrow(() => {
//           return resourceLoader(options);
//         }, options?.signal))
//       }, Promise.reject(new Error(`No ressources`)));
//     }
//   }
//
//   function httpResourceLoader(
//     src: string,
//   ): IResourceLoader {
//     return (options?: IOptionsWithAbortSignal): Promise<Blob> => {
//       return fetch(src, options)
//         .then(wrapFunctionWithOptionalAbortSignalAndThrow((response: Response) => {
//           return response.blob();
//         }, options?.signal));
//     };
//   }
//
//   function imageLoader(
//     src: string,
//   ): IResourceLoader {
//     return httpResourceLoader(src);
//   }
//
//   function matchesMedia(
//     load: IResourceLoader,
//   ): IResourceLoader {
//     const mediaQueryList = window.matchMedia('(max-width: 600px)');
//     return (options?: IOptionsWithAbortSignal): Promise<Blob> => {
//       if (mediaQueryList.matches) {
//         return load(options);
//       } else {
//         throw new Error(`Doesn't match media`);
//       }
//     };
//   }
//
//   function supportsType(
//     src: string,
//   ): IResourceLoader {
//     return httpResourceLoader(src);
//   }
//
//
//   @Component({
//     name: 'app-image',
//   })
//   class AppImageComponent extends HTMLElement {
//     public readonly load: IResourceLoader;
//
//     constructor(
//       loader: IResourceLoader,
//     ) {
//       super();
//       this.load = loader;
//     }
//   }
//
//
//   const img = new AppImageComponent(sequentialResourcesLoader([
//     imageLoader('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/Sample-image10-highres.jpg'),
//     imageLoader('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/sample_07_0.jpg'),
//     imageLoader('https://www.roadrunnerrecords.com/sites/g/files/g2000005056/f/Sample%202_0.jpg'),
//   ]));
//
//   console.log(await img.load());
//
//   nodeAppendChild(document.body, img);
// }

// const left = createMulticastReplayLastSource({ initialValue: 0 });
// const left = createMulticastReplayLastSource({ initialValue: 0 });
// const left = createMulticastReplayLastSource({ initialValue: 0 });
// const left = createMulticastReplayLastSource({ initialValue: 0 });


/**
 * Window
 */
async function debugReactiveDOMCompiler8() {

  const win = new AppWindowComponent();
  bootstrap(win);

  // win.subscribeRight((value: number) => {
  //   console.log('right', value);
  // });


  (window as any).win = win;
}

/**
 * Compile debug
 */
async function debugReactiveDOMCompiler9() {
  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_CONSTANTS_TO_IMPORT,
    eq$$,
  };

  // const code = `<div (click)="() => "></div>`;
  // const code = `<div [attr.b]="single('a')"></div>`;
  // const code = `<div [attr.b]="true"></div>`;
  const code = `<div [attr.b]="eq$$($.a.l, $.b)"></div>`;

  const compiled = compileAndEvaluateReactiveHTMLAsComponentTemplate<any>(
    code,
    CONSTANTS_TO_IMPORT,
  );

  const fragment = compiled({ data: {} } as any);

  attachNode(fragment, getDocumentBody());

}

/*----*/


export async function debugReactiveDOMCompiler() {
  // await debugReactiveDOMCompiler1();
  // await debugReactiveDOMCompiler2();
  // await debugReactiveDOMCompiler3();
  // await debugReactiveDOMCompiler4();
  // await debugReactiveDOMCompiler5();
  await debugReactiveDOMCompiler6();
  // await debugReactiveDOMCompiler7();
  // await debugReactiveDOMCompiler8();
  // await debugReactiveDOMCompiler9();
}
