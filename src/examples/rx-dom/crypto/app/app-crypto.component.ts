import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import style from './app-crypto.component.scss?inline';
// @ts-ignore
import html from './app-crypto.component.html?raw';


// function


/** COMPONENT **/

interface IData {
}

@Component({
  name: 'app-crypto',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppCryptoComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();

    this.data = {};
  }

  onCreate(): IData {
    return this.data;
  }
}





