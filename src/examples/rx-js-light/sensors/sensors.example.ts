import { IObserver, mapObserver, notificationObserver } from '@lifaon/rx-js-light';
import { accelerometerSensorObservable } from './sensor/motion/accelerometer/accelerometer-sensor-observable';
import { deviceOrientationObservable } from './sensor/orientation/device/device-orientation-observable';
import { ambientLightSensorObservable } from './sensor/ambient-light/ambient-light-sensor-observable';
import { magnetometerSensorObservable } from './sensor/motion/magnetometer/magnetometer-sensor-observable';
import { gravitySensorObservable } from './sensor/motion/accelerometer/derived/gravity-sensor-observable';
import {
  absoluteOrientationSensorObservable
} from './sensor/orientation/absolute/absolute-orientation-sensor-observable';
import { gyroscopeSensorObservable } from './sensor/motion/gyroscope/gyroscope-sensor-observable';
import {
  relativeOrientationSensorObservable
} from './sensor/orientation/relative/relative-orientation-sensor-observable';
import { BATTERY_OBSERVABLE } from './state/battery/battery-observable.constant';
import { NETWORK_OBSERVABLE } from './state/network/network-observable.constant';
import { ONLINE_OBSERVABLE } from './state/online/online-observable.constant';
import { DEVICE_ORIENTATION } from './sensor/orientation/device/device-orientation-observable.constant';
import { DEVICE_MOTION } from './sensor/motion/device/device-motion-observable.constant';
import { SCREEN_ORIENTATION_OBSERVABLE } from './sensor/orientation/screen/screen-orientation-observable.constant';


/*------------*/

function createOutput(): IObserver<string> {
  const output = document.createElement('pre');
  document.body.appendChild(output);

  return (value: string): void => {
    // output.innerText += value + '\n';
    output.innerText = value + '\n' + output.innerText;
  };
}

function createAnyOutput(): IObserver<any> {
  return mapObserver(createOutput(), (value: any) => {
    return JSON.stringify(value, (key: string, value: any): any => {
      if (value instanceof Error) {
        return {
          message: value.message,
          stack: value.stack,
        };
      } else {
        return value;
      }
    }, 2);
  });
}

/*------------*/

function queryPermission(
  name: string,
): Promise<void> {
  return navigator.permissions.query({ name: name as any })
    .then((result: PermissionStatus): void => {
      if (result.state === 'denied') {
        throw new Error(`Permission to '${ name }' is denied.`);
      }
    });
}

function queryPermissions(
  names: string[],
): Promise<void> {
  return Promise.all(names.map(queryPermission))
    .then(() => {});
}

function queryPermissionsAndCreateOutput<GValue>(
  names: string[],
  callback: ($output: IObserver<any>) => (void | Promise<void>),
): Promise<void> {
  const $output = createAnyOutput();
  return queryPermissions(names)
    .then(() => callback($output), $output);
}

/** SENSORS **/

/* ORIENTATION */

export async function deviceOrientationObservableExample() {
  DEVICE_ORIENTATION(createAnyOutput());
}

export async function screenOrientationObservableExample() {
  SCREEN_ORIENTATION_OBSERVABLE(createAnyOutput());
}


export async function absoluteOrientationSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['accelerometer', 'gyroscope', 'magnetometer'], ($output) => {
    absoluteOrientationSensorObservable({ frequency: 1 })($output);
  });
}

export async function relativeOrientationSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['accelerometer', 'gyroscope'], ($output) => {
    relativeOrientationSensorObservable({ frequency: 1 })($output);
  });
}


/* MOTION */

export async function deviceMotionObservableExample() {
  DEVICE_MOTION(createAnyOutput());
}


export async function accelerometerSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['accelerometer'], ($output) => {
    accelerometerSensorObservable({ frequency: 1 })($output);
  });
}

export async function gravitySensorObservableExample() {
  await queryPermissionsAndCreateOutput(['accelerometer'], ($output) => {
    gravitySensorObservable({ frequency: 1 })($output);
  });
}

export async function magnetometerSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['magnetometer'], ($output) => {
    magnetometerSensorObservable({ frequency: 1 })($output);
  });
}

export async function gyroscopeSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['gyroscope'], ($output) => {
    gyroscopeSensorObservable({ frequency: 1 })($output);
  });
}


/* OTHERS */

export async function ambientLightSensorObservableExample() {
  await queryPermissionsAndCreateOutput(['ambient-light-sensor'], ($output) => {
    ambientLightSensorObservable({ frequency: 1 })($output);
  });
}


/** OTHERSv **/

export async function batteryObservableExample() {
  const $output = createAnyOutput();
  BATTERY_OBSERVABLE(notificationObserver({
    next: $output,
    error: $output,
  }));
}

export async function networkObservableExample() {
  const $output = createAnyOutput();
  NETWORK_OBSERVABLE($output);
}

export async function onlineObservableExample() {
  const $output = createAnyOutput();
  ONLINE_OBSERVABLE($output);
}

/*------------*/

export async function sensorsExample() {
  // await deviceOrientationObservableExample();
  await screenOrientationObservableExample();
  // await absoluteOrientationSensorObservableExample();
  // await relativeOrientationSensorObservableExample();

  // await deviceMotionObservableExample();
  // await accelerometerSensorObservableExample();
  // await gravitySensorObservableExample();
  // await magnetometerSensorObservableExample();
  // await gyroscopeSensorObservableExample();

  // await ambientLightSensorObservableExample();

  // await batteryObservableExample();
  // await networkObservableExample();
  // await onlineObservableExample();
}


