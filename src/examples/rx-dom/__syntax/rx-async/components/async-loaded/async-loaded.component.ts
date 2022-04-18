import { IObservable } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate, Component, HTMLElementWithInputs, IComponentInput, OnCreate,
} from '@lirx/dom';

/** COMPONENT **/


interface IData {
  readonly value$: IObservable<string>;
}

type IComponentInputs = [
  IComponentInput<'value', string>,
];


@Component({
  name: 'app-async-loaded-component',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      Async loaded: {{ $.value$ }}
    `,
  }),
})
export class AppAsyncComponentLoadedComponent extends HTMLElementWithInputs<IComponentInputs>(['value']) implements OnCreate<IData> {
  public onCreate(): IData {
    return {
      value$: this.value$,
    };
  }
}

