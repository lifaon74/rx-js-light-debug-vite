import {
  fromEventTarget, ISubscribeFunction, mapSubscribePipe, pipeSubscribeFunction, toTypedPureEventTarget
} from '@lifaon/rx-js-light';

interface IDeviceOrientation {
  readonly absolute: boolean;
  readonly alpha: number | null;
  readonly beta: number | null;
  readonly gamma: number | null;
}

function deviceOrientation(): ISubscribeFunction<IDeviceOrientation> {
  return pipeSubscribeFunction(fromEventTarget<'deviceorientation', DeviceOrientationEvent>(toTypedPureEventTarget(window), 'deviceorientation'), [
    mapSubscribePipe((event: DeviceOrientationEvent): IDeviceOrientation => {
      return {
        absolute: event.absolute,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
    })
  ]);
}


/*------------*/

export async function sensorsExample() {
  deviceOrientation()((orientation: IDeviceOrientation) => {
    console.log(orientation);
  });
}


