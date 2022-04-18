import { IObservable, single } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, Component, IComponentTemplate, OnCreate } from '@lirx/dom';

/** HELPERS **/

class Range {
  readonly start: number;
  readonly end: number;

  constructor(
    start: number,
    end?: number,
  ) {
    if (end === void 0) {
      this.start = 0;
      this.end = start;
    } else {
      this.start = start;
      this.end = end;
    }
  }

  * [Symbol.iterator](): IterableIterator<any> {
    for (let i = this.start; i < this.end; i++) {
      yield i;
    }
  }
}

/** DATA **/

interface IData {
  readonly rows$: IObservable<Iterable<number>>;
  readonly columns$: IObservable<Iterable<number>>;
}

/** TEMPLATE **/

const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
  html: `
    <rx-template
      name="cellTemplate"
      let-row
      let-column
    >
      R{{ row }} - C{{ column }}
    </rx-template>
    
    <table>
      <tr *for="let row of $.rows$">
        <td *for="let column of $.columns$">
          <rx-inject-template
            template="cellTemplate"
            let-row="row"
            let-column="column"
          ></rx-inject-template>
        </td>
      </tr>
    </table>
  `,
});

/** COMPONENT **/

@Component({
  name: 'app-rx-template-example',
  template,
})
export class AppRxTemplateExampleComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    const rows$ = single(new Range(5));
    const columns$ = single(new Range(3));

    this._data = {
      rows$,
      columns$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
