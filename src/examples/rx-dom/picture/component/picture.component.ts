import {
  compileReactiveCSSAsComponentStyle, Component, HTMLElementWithInputs, IComponentInput, setReactiveStyle,
} from '@lirx/dom';
// @ts-ignore
import style from './picture.component.scss?inline';
import { map$$ } from '@lirx/core';

/** COMPONENT **/

type IComponentInputs = [
  IComponentInput<'src', string>,
];

@Component({
  name: 'app-picture',
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class PictureComponent extends HTMLElementWithInputs<IComponentInputs>(['src']) {
  constructor() {
    super();
    this.src = '';
    const backgroundImage$ = map$$(this.src$, (src: string) => `url(${src})`);
    setReactiveStyle(backgroundImage$, this, 'background-image');
  }
}




