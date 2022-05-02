import { compileReactiveCSSAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE } from '@lirx/dom';
// @ts-ignore
import style from './mat-toolbar.component.scss?inline';


/** COMPONENT **/
@Component({
  name: 'mat-toolbar',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatToolbarComponent extends HTMLElement {
}
