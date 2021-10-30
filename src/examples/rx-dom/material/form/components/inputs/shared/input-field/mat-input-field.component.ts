import {
  compileReactiveCSSAsComponentStyle, injectComponentStyle, setComponentSubscribeFunctionProperties
} from '@lifaon/rx-dom';
import { let$$ } from '@lifaon/rx-js-light-shortcuts';
import { IEmitFunction, ISubscribeFunction, single } from '@lifaon/rx-js-light';
import { MatInputComponent } from '../input/mat-input.component';
// @ts-ignore
import style from './mat-input-field.component.scss?inline';

const componentStyle = compileReactiveCSSAsComponentStyle(style);

/** COMPONENT **/

export abstract class MatInputFieldComponent<GValue> extends MatInputComponent<GValue> {
  placeholder$!: ISubscribeFunction<string>;
  readonly $placeholder!: IEmitFunction<string>;
  placeholder!: string;

  protected constructor(
    initialValue: GValue,
  ) {
    super(initialValue);

    const $placeholder$ = let$$<ISubscribeFunction<string>>(single(''));
    setComponentSubscribeFunctionProperties(this, 'placeholder', $placeholder$);

    injectComponentStyle(componentStyle, this);
  }
}
