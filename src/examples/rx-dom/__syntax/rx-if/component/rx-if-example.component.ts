import { interval, IObservable, map$$, merge, single } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, Component, IComponentTemplate, OnCreate } from '@lirx/dom';


/** DATA **/

interface IData {
  readonly visible$: IObservable<boolean>;
}

/** TEMPLATE **/

const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
  html: `
    <div *if="$.visible$">
      I'm visible
    </div>
  `,
});

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-if condition="$.visible$">
//       <div *if-true>
//         I'm visible
//       </div>
//       <div *if-false>
//         Invisible
//       </div>
//     </rx-if>
//   `,
// });

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-if condition="$.visible$">
//       <rx-if-true>
//         I'm visible
//       </rx-if-true>
//       <rx-if-false>
//         Invisible
//       </rx-template>
//     </rx-if-false>
//   `,
// });

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-template name="trueTemplate">
//       I'm visible
//     </rx-template>
//     <rx-template name="falseTemplate">
//       Invisible
//     </rx-template>
//
//     <rx-if
//       condition="$.visible$"
//       true="trueTemplate"
//       false="falseTemplate"
//     ></rx-if>
//   `,
// });


/** COMPONENT **/

@Component({
  name: 'app-rx-if-example',
  template,
})
export class AppRxIfExampleComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    const toggleTime: number = 1000;

    const visible$ = map$$(merge([interval(1000), single(void 0)]), () => ((Date.now() % (toggleTime * 2)) < toggleTime));

    this._data = {
      visible$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
