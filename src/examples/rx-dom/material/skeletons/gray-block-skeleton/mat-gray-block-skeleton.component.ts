import {
  compileReactiveCSSAsComponentStyle, Component, loadAndCompileReactiveCSSAsComponentStyle,
  loadReactiveHTMLAsGenericComponentTemplate
} from '@lifaon/rx-dom';
// @ts-ignore
import style from './mat-gray-block-skeleton.component.scss?inline';


/** COMPONENT **/


@Component({
  name: 'mat-gray-block-skeleton',
  // styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatGrayBlockSkeletonComponent extends HTMLElement {
}
