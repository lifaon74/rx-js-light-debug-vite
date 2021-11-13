import { fromEventTarget, IObservable, map$$, toTypedEventTarget } from '@lifaon/rx-js-light';

interface IDeviceOrientation {
  readonly absolute: boolean;
  readonly alpha: number | null;
  readonly beta: number | null;
  readonly gamma: number | null;
}

function deviceOrientation(): IObservable<IDeviceOrientation> {
  return map$$(
    fromEventTarget<'deviceorientation', DeviceOrientationEvent>(toTypedEventTarget(window), 'deviceorientation'),
    (event: DeviceOrientationEvent): IDeviceOrientation => {
      return {
        absolute: event.absolute,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
    }
  );
}


/*------------*/

export async function sensorsExample() {
  deviceOrientation()((orientation: IDeviceOrientation) => {
    console.log(orientation);
  });
}


