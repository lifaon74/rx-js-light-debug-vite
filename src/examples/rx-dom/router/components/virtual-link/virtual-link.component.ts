import { Component } from '@lifaon/rx-dom';
import { NAVIGATION } from '../../navigation/navigation';
import {
  createEventListener, ISource, ISubscribeFunction, mergeAllSingleSubscribePipe, noop, pipeSubscribeFunction, single
} from '@lifaon/rx-js-light';
import { const$$, let$$ } from '@lifaon/rx-js-light-shortcuts';


export type IHavingSubscribeFunctionProperties<GName extends string, GValue> =
  Record<`${ GName }$`, ISubscribeFunction<GValue>>
  & Record<GName, GValue>;

export type IObjectWithSubscribeFunctionProperties<GTarget extends object, GName extends string, GValue> =
  GTarget
  & IHavingSubscribeFunctionProperties<GName, GValue>;

export type IPropertySetMode = 'enable' | 'skip' | 'throw';

/**
 * TODO migrate into rx-dom
 */
export function setComponentSubscribeFunctionProperties<GTarget extends object, GName extends string, GValue>(
  target: GTarget,
  propertyName: GName,
  // $source$: IReplayLastSource<ISubscribeFunction<GValue>, ISource<ISubscribeFunction<GValue>>>,
  $source$: ISource<ISubscribeFunction<GValue>>,
  setMode: IPropertySetMode = 'enable',
): IObjectWithSubscribeFunctionProperties<GTarget, GName, GValue> {

  const source$: ISubscribeFunction<GValue> = pipeSubscribeFunction($source$.subscribe, [
    mergeAllSingleSubscribePipe<GValue>(),
  ]);

  // let cachedValue: GValue;
  // source$((value: GValue): void => {
  //   cachedValue = value;
  // });

  const generateSetForProperty$ = (): ((value: ISubscribeFunction<GValue>) => void)  => {
    switch (setMode) {
      case 'enable':
        return (value: ISubscribeFunction<GValue>): void => {
          $source$.emit(value);
        };
      case 'skip':
        return noop;
      case 'throw':
        return () => {
          throw new Error(`Readonly`);
        };
      default:
        throw new Error(`Invalid mode`);
    }
  };

  const generateSetForProperty = (): ((value: GValue) => void)  => {
    switch (setMode) {
      case 'enable':
        return (value: GValue): void => {
          $source$.emit(single(value));
        };
      case 'skip':
        return noop;
      case 'throw':
        return () => {
          throw new Error(`Readonly`);
        };
      default:
        throw new Error(`Invalid mode`);
    }
  };

  Object.defineProperty(target, `${ propertyName }$`, {
    configurable: true,
    enumerable: true,
    get: (): ISubscribeFunction<GValue> => {
      return source$;
    },
    set: generateSetForProperty$(),
  });

  Object.defineProperty(target, propertyName, {
    configurable: true,
    enumerable: true,
    get: (): GValue => {
      let cachedValueReceived: boolean = false;
      let cachedValue!: GValue;

      source$((value: GValue): void => {
        cachedValueReceived = true;
        cachedValue = value;
      })();

      if (!cachedValueReceived) {
        console.warn(`The source did not send immediately a value`);
      }

      return cachedValue;
    },
    set: generateSetForProperty(),
  });

  return target as any;
}


/*---*/

export type ISubscribeFunctionProperty<GName extends string, GValue> = [name: GName, value: GValue];
export type IGenericSubscribeFunctionProperty = ISubscribeFunctionProperty<string, any>;

export type IHavingSubscribeFunctionPropertiesFromPropertyTuple<GProperty extends IGenericSubscribeFunctionProperty> =
  IHavingSubscribeFunctionProperties<GProperty[0], GProperty[1]>;

export type IHavingMultipleSubscribeFunctionProperties<GProperties extends readonly IGenericSubscribeFunctionProperty[]> = {
  [GKey in Extract<keyof GProperties, number>]: IHavingSubscribeFunctionPropertiesFromPropertyTuple<GProperties[GKey]>;
}[Extract<keyof GProperties, number>];

export type IObjectWithMultipleSubscribeFunctionProperties<GTarget extends object, GProperties extends readonly IGenericSubscribeFunctionProperty[]> =
  GTarget
  & IHavingMultipleSubscribeFunctionProperties<GProperties>;


export function setComponentMultipleSubscribeFunctionProperties<GTarget extends object, GProperties extends readonly IGenericSubscribeFunctionProperty[]>(
  target: GTarget,
  properties: GProperties,
): IObjectWithMultipleSubscribeFunctionProperties<GTarget, GProperties> {
  for (let i = 0, l = properties.length; i < l; i++) {
    setComponentSubscribeFunctionProperties(target, properties[i][0], properties[i][1]);
  }
  return target as any;
}

/** COMPONENT **/


@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElement implements IHavingMultipleSubscribeFunctionProperties<[['replaceState', boolean]]> {
  replaceState$!: ISubscribeFunction<boolean>;
  replaceState!: boolean;

  constructor() {
    super();
    const $replaceState$ = let$$(const$$<boolean>(false));

    setComponentMultipleSubscribeFunctionProperties(this, [
      ['replaceState', $replaceState$],
    ]);

    // this.replaceState$((state: boolean) => {
    //   console.log('state', state);
    // });

    createEventListener(this, 'click', (event: MouseEvent) => {
      if (
        (event.button === 0)
        && !event.ctrlKey
        && (this.target !== '_blank')
        && ['http:', 'https:'].includes(new URL(this.href, this.baseURI).protocol)
      ) {
        event.preventDefault();
        NAVIGATION.navigate(this.href, this.replaceState);
      }
    });
  }
}
