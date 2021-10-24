import { interval, ISubscribeFunction } from '@lifaon/rx-js-light';

;
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './aot.component.html?raw';
// @ts-ignore
import style from './aot.component.scss?inline';
import { map$$ } from '../../../../../rx-js-light-shortcuts/dist';

/** COMPONENT **/

interface IData {
  readonly now$: ISubscribeFunction<string>;
}


@Component({
  name: 'app-aot',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
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
