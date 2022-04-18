import { map$$ } from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, Component, HTMLElementWithInputs, IComponentInput, setReactiveClassList,
  setReactiveStyle,
} from '@lirx/dom';
// @ts-ignore
import style from './mat-icon.component.scss';

/** FUNCTIONS **/

function toCSSPx(
  value: number,
): string {
  return `${value}px`;
}

/** COMPONENT **/

type IComponentInputs = [
  IComponentInput<'name', string>,
  IComponentInput<'sizeInner', number>,
  IComponentInput<'sizeOuterX', number>,
  IComponentInput<'sizeOuterY', number>,
];


@Component({
  name: 'mat-icon',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatIconComponent extends HTMLElementWithInputs<IComponentInputs>(['name', 'sizeInner', 'sizeOuterX', 'sizeOuterY']) {
  constructor() {
    super();

    setReactiveClassList(map$$(this.name$, (value: string) => new Set((value === '') ? [] : [value])), this);
    setReactiveStyle(map$$(this.sizeInner$, toCSSPx), this, '--mat-icon-size-inner');
    setReactiveStyle(map$$(this.sizeOuterX$, toCSSPx), this, '--mat-icon-size-outer-x');
    setReactiveStyle(map$$(this.sizeOuterY$, toCSSPx), this, '--mat-icon-size-outer-y');
  }
}
