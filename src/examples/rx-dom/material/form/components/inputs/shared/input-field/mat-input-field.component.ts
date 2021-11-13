import {
  compileReactiveCSSAsComponentStyle, injectComponentStyle, defineObservableProperty
} from '@lifaon/rx-dom';
import { IObserver, IObservable, single, let$$ } from '@lifaon/rx-js-light';
import { MatInputComponent } from '../input/mat-input.component';
// @ts-ignore
import style from './mat-input-field.component.scss?inline';

const componentStyle = compileReactiveCSSAsComponentStyle(style);

export function injectMatInputFieldStyle(
  target: HTMLElement,
) {
  injectComponentStyle(componentStyle, target);
}

/** COMPONENT **/

/**
 * @deprecated
 */
export abstract class MatInputFieldComponent<GValue> extends MatInputComponent<GValue> {
  placeholder$!: IObservable<string>;
  readonly $placeholder!: IObserver<string>;
  placeholder!: string;

  constructor(
    initialValue: GValue,
  ) {
    super(initialValue);

    const $placeholder$ = let$$<IObservable<string>>(single(''));
    defineObservableProperty(this, 'placeholder', $placeholder$);

    injectMatInputFieldStyle(this);
  }
}
