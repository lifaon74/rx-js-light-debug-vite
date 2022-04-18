import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
import { AppInjectContentComponent } from './inject-content.component';
import { debounceFrame$$$, interval, IObservable, map$$$, pipe$$, single } from '@lirx/core';
import { shuffleArray } from '../../misc/shuffle-array';


/** COMPONENT **/

interface IItem {
  readonly name$: IObservable<string>;
}

interface IData {
  readonly items$: IObservable<readonly IItem[]>;
  readonly single: typeof single;
}


@Component({
  name: 'app-inject-content-parent',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <rx-template name="header">
        header
      </rx-template>
      <app-inject-content
        [headerTemplate.value]="template_header"
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
    `,
    customElements: [
      AppInjectContentComponent,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `)],
})
export class AppInjectContentParentComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly _data: IData;

  constructor() {
    super();
    const items = Array.from({ length: 10 }, (v: any, index: number): IItem => {
      return {
        name$: single(`#${ index }`),
      };
    });

    const items$ = pipe$$(interval(2000), [
      debounceFrame$$$(),
      map$$$(() => shuffleArray(items)),
    ]);

    this._data = {
      items$,
      single,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

