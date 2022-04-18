import { compileReactiveCSSAsComponentStyle, Component } from '@lirx/dom';
// @ts-ignore
import style from './mat-gray-block-skeleton.component.scss?inline';


/** COMPONENT **/


@Component({
  name: 'mat-gray-block-skeleton',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatGrayBlockSkeletonComponent extends HTMLElement {
}
