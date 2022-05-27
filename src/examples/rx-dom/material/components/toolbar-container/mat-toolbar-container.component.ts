import { function$$, IObservable } from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, HTMLElementWithInputs,
  IComponentInput, IComponentInputListToPropertyNameList, IReactiveContent, OnCreate, setReactiveClassList,
} from '@lirx/dom';
// @ts-ignore
import html from './mat-toolbar-container.component.html?raw';
// @ts-ignore
import style from './mat-toolbar-container.component.scss?inline';
import {
  getElementChildAsReactiveContentObservable
} from '../../helpers/get-element-child-as-reactive-content-observable';

/** TYPES **/

// https://material.angular.io/components/toolbar/overview

export type IMatToolbarComponentPosition =
  | 'start'
  | 'end'
  ;

/** COMPONENT **/

interface IData {
  readonly toolbar$: IObservable<IReactiveContent>;
  readonly content$: IObservable<IReactiveContent>;
}

type IComponentInputs = [
  IComponentInput<'position', IMatToolbarComponentPosition>,
];

const COMPONENT_INPUTS: IComponentInputListToPropertyNameList<IComponentInputs> = [
  'position',
];

@Component({
  name: 'mat-toolbar-container',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatToolbarContainerComponent extends HTMLElementWithInputs<IComponentInputs>(COMPONENT_INPUTS) implements OnCreate<IData> {
  constructor() {
    super();
  }

  public onCreate(
    $content: DocumentFragment,
  ): IData {
    const toolbar$ = getElementChildAsReactiveContentObservable($content, ':scope > [toolbar], :scope > mat-toolbar');
    const content$ = getElementChildAsReactiveContentObservable($content, ':scope > [content]');
    // const toolbar$ = getElementChildAsReactiveContentObservable($content, '[toolbar], mat-toolbar');
    // const content$ = getElementChildAsReactiveContentObservable($content, '[content]');

    const position$ = this.position$;

    const classList$ = function$$(
      [position$],
      (position) => {
        return new Set([
          `mat-position-${position}`,
        ]);
      },
    );
    setReactiveClassList(classList$, this);

    return {
      content$,
      toolbar$,
    };
  }
}
