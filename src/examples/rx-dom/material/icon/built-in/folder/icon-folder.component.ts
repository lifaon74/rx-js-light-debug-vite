import { compileReactiveHTMLAsComponentTemplate, Component } from '@lirx/dom';
// @ts-ignore
import html from './icon-folder.component.svg?raw';
import { MAT_ICON_STYLE_CONSTANT } from '../../mat-icon.style.constant';

/** COMPONENT **/

@Component({
  name: 'icon-folder',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [MAT_ICON_STYLE_CONSTANT],
})
export class IconFolderComponent extends HTMLElement {
}
