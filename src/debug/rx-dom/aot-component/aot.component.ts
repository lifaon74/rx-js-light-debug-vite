import { interval, IObservable, map$$ } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './aot.component.html?raw';
// @ts-ignore
import style from './aot.component.scss?inline';

/** COMPONENT **/

interface IData {
  readonly now$: IObservable<string>;
}


@Component({
  name: 'app-aot',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AotComponent<GValue> extends HTMLElement implements OnCreate<IData> {

  constructor() {
    super();
  }

  onCreate(): IData {
    const now$ = map$$(interval(1000), () => new Date().toISOString());
    return {
      now$,
    };
  }
}
