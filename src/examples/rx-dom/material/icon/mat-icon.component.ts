import { map$$, } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, Component, HTMLElementConstructor, setReactiveClassList, setReactiveStyle,
} from '@lifaon/rx-dom';
import {
  createHigherOrderVariable, createHigherOrderVariableUninitialized,
} from '../../../misc/create-higher-order-variable';
// @ts-ignore
import style from './mat-icon.component.scss';
import { havingMultipleObservableProperties } from '../../../misc/having-multiple-subscribe-function-properties';

/** FUNCTIONS **/

function toCSSPx(
  value: number,
): string {
  return `${ value }px`;
}

/** COMPONENT **/

type IMatIconComponentInputs = [
  ['name', string],
  ['sizeInner', number],
  ['sizeOuterX', number],
  ['sizeOuterY', number],
];

@Component({
  name: 'mat-icon',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatIconComponent extends havingMultipleObservableProperties<IMatIconComponentInputs, HTMLElementConstructor>(HTMLElement) {
  constructor() {
    console.log('mat icon created');
    const [$name$, name$] = createHigherOrderVariable<string>('');
    const [$sizeInner$, sizeInner$] = createHigherOrderVariableUninitialized<number>();
    const [$sizeOuterX$, sizeOuterX$] = createHigherOrderVariableUninitialized<number>();
    const [$sizeOuterY$, sizeOuterY$] = createHigherOrderVariableUninitialized<number>();

    super([
      ['name', $name$],
      ['sizeInner', $sizeInner$],
      ['sizeOuterX', $sizeOuterX$],
      ['sizeOuterY', $sizeOuterY$],
    ]);

    setReactiveClassList(map$$(name$, (value: string) => new Set((value === '') ? [] : [value])), this);
    setReactiveStyle(map$$(sizeInner$, toCSSPx), this, '--mat-icon-size-inner');
    setReactiveStyle(map$$(sizeOuterX$, toCSSPx), this, '--mat-icon-size-outer-x');
    setReactiveStyle(map$$(sizeOuterY$, toCSSPx), this, '--mat-icon-size-outer-y');
  }
}
