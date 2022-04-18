import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import style from './gyro-cube.component.scss';
// @ts-ignore
import html from './gyro-cube.component.html?raw';
import { IObservable, map$$ } from '@lirx/core';
import {
  DEVICE_ORIENTATION,
} from '../../../rx-js-light/sensors/sensor/orientation/device/device-orientation-observable.constant';
import { IDeviceOrientation } from '../../../rx-js-light/sensors/sensor/orientation/device/device-orientation.type';

/** COMPONENT **/

// https://www.youtube.com/watch?v=aqz-KE-bpKQ

interface IData {
  readonly transform$: IObservable<string>;
}

@Component({
  name: 'app-gyro-cube',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class GyroCubeComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();

    const transform$ = map$$(DEVICE_ORIENTATION, deviceOrientationToCSSTransform);

    this.data = {
      transform$,
    };
  }

  onCreate(): IData {
    return this.data;
  }
}

function deviceOrientationToCSSTransform(
  {
    alpha,
    beta,
    gamma,
  }: IDeviceOrientation,
): string {
  alpha = (alpha === null) ? 0 : alpha;
  beta = (beta === null) ? 0 : beta;
  gamma = (gamma === null) ? 0 : gamma;

  const a = (alpha > 180) ? (alpha - 360) : alpha;
  const b = (beta - 90);
  const g = (gamma > 180) ? (360 - gamma) : -gamma;
  return `rotateX(${b}deg) rotateY(${g}deg) rotateZ(${a}deg)`;
}





