import { toCSSPx, } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, Component, HTMLElementConstructor, setReactiveClassList, setReactiveStyle,
} from '@lifaon/rx-dom';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import {
  createHigherOrderVariable, createHigherOrderVariableUninitialized,
} from '../../../../misc/create-higher-order-variable';
// @ts-ignore
import style from './mat-button.component.scss';
import { havingMultipleSubscribeFunctionProperties } from '../../../../misc/having-multiple-subscribe-function-properties';


/** COMPONENT **/

export type IMatButtonMode =
  'basic'
  | 'raised'
  | 'stroked'
  | 'flat'
  ;

type IMatButtonComponentInputs = [
  ['mode', IMatButtonMode],
];

@Component({
  name: 'mat-button',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatButtonComponent extends havingMultipleSubscribeFunctionProperties<IMatButtonComponentInputs, HTMLElementConstructor>(HTMLElement) {
  constructor() {
    const [$mode$, mode$] = createHigherOrderVariable<IMatButtonMode>('basic');

    super([
      ['mode', $mode$],
    ]);

    // setReactiveClassList(map$$(name$, (value: string) => new Set((value === '') ? [] : [value])), this);
    // setReactiveStyle(map$$(sizeInner$, toCSSPx), this, '--mat-icon-size-inner');
    // setReactiveStyle(map$$(sizeOuterX$, toCSSPx), this, '--mat-icon-size-outer-x');
    // setReactiveStyle(map$$(sizeOuterY$, toCSSPx), this, '--mat-icon-size-outer-y');
  }
}
