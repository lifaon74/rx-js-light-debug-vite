import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateCreateElementFunctionWithCustomElements, OnCreate,
} from '@lifaon/rx-dom';
import { AppInjectContentComponent } from './inject-content.component';
import { interval, IObservable, map$$$, of, pipe$$, single } from '@lifaon/rx-js-light';
import { shuffleArray } from '../../misc/shuffle-array';

export const APP_INJECT_CONTENT_PARENT_CUSTOM_ELEMENTS = [
  AppInjectContentComponent,
];


/** COMPONENT **/

interface IItem {
  name$: IObservable<string>;
}

interface IData {
  items$: IObservable<readonly IItem[]>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_INJECT_CONTENT_PARENT_CUSTOM_ELEMENTS),
  of,
};

@Component({
  name: 'app-inject-content-parent',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`

    <rx-template #header>
      header
    </rx-template>
    
    <app-inject-content
      [header$]="of(of(getTemplateReference('header')))"
    >
      <div body>
        <div
          class="item"
          *for="let item of $.items$"
        >
         {{ item.name$ }}
        </div>
      </div>
      <div footer>
        footer
      </div>
    </app-inject-content>
    
  `, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `)],
})
export class AppInjectContentParentComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const items = Array.from({ length: 10 }, (v: any, index: number): IItem => {
      return {
        name$: single(`#${ index }`),
      };
    });

    const items$ = pipe$$(interval(2000), [
      map$$$(() => shuffleArray(items)),
    ]);

    this.data = {
      items$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}

