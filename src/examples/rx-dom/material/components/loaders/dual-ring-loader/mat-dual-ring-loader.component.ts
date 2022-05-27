import { compileReactiveCSSAsComponentStyle, Component } from '@lirx/dom';
// @ts-ignore
import style from './mat-dual-ring-loader.component.scss?inline';

/**
 * COMPONENT: 'mat-dual-ring-loader'
 */

@Component({
  name: 'mat-dual-ring-loader',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatDualRingLoaderComponent extends HTMLElement {
}
