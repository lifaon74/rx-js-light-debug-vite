import {
  createErrorNotification, createEventListener, createNextNotification, IErrorNotification, INextNotification,
  IObservable, IObserver, IRemoveEventListener, IUnsubscribe,
} from '@lifaon/rx-js-light';

export type ISensorObservableNotifications<GValue> =
  INextNotification<GValue>
  | IErrorNotification;

export interface ISensorFactory<GSensor extends Sensor> {
  (): GSensor;
}

export interface ISensorValueMapFunction<GSensor extends Sensor, GValue> {
  (sensor: GSensor): GValue;
}

export function createSensorObservable<GSensor extends Sensor, GValue>(
  sensorFactory: ISensorFactory<GSensor>,
  mapFunction: ISensorValueMapFunction<GSensor, GValue>,
): IObservable<ISensorObservableNotifications<GValue>> {
  return (emit: IObserver<ISensorObservableNotifications<GValue>>): IUnsubscribe => {
    const sensor: GSensor = sensorFactory();

    const removeReadingListener: IRemoveEventListener = createEventListener<'reading', Event>(sensor, 'reading', (): void => {
      emit(createNextNotification<GValue>(mapFunction(sensor)));
    });

    const removeErrorListener: IRemoveEventListener = createEventListener<'error', SensorErrorEvent>(sensor as any, 'error', (event: SensorErrorEvent): void => {
      emit(createErrorNotification(event.error));
    });

    sensor.start();

    return (): void => {
      sensor.stop();
      removeReadingListener();
      removeErrorListener();
    };
  };
}
