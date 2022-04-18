import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import style from './mat-positioned-overlay-content.component.scss';
// @ts-ignore
import html from './mat-positioned-overlay-content.component.html?raw';

/** COMPONENT **/


interface IData {

}

@Component({
  name: 'mat-positioned-overlay-content',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatPositionedOverlayContentComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();

    this.data = {};
  }

  onCreate(): IData {
    return this.data;
  }
}
