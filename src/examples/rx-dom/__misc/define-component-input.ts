import { createComponentInput, IComponentInput, objectDefineProperty } from '@lifaon/rx-dom';
import { ICreateMulticastReplayLastSourceOptions } from '@lifaon/rx-js-light';

// export type IDefineComponentInputGNameConstraint< // generics
//   GTarget,
//   GName,
//   //
//   > =
//   [GName] extends [keyof GTarget]
//     ? (
//       GTarget[GName] extends IComponentInput<any>
//         ? string
//         : never
//       )
//     : never
//   ;
//
// export type IDefineComponentInputGValueConstraint< // generics
//   GTarget,
//   GName extends string,
//   GValue,
//   //
//   > =
//   GName extends keyof GTarget
//     ? (
//       GTarget[GName] extends IComponentInput<GValue>
//         ? any
//         : never
//       )
//     : never
//   ;
//
//
// export function defineComponentInput< // generics
//   GTarget,
//   GName extends IDefineComponentInputGNameConstraint<GTarget, GName>,
//   GValue extends IDefineComponentInputGValueConstraint<GTarget, GName, GValue>,
//   //
//   >(
//   target: GTarget,
//   propertyName: GName,
//   options?: ICreateMulticastReplayLastSourceOptions<GValue>,
// ): void {

export function defineComponentInput< // generics
  GValue,
  GName extends string,
  GTarget extends Record<GName, IComponentInput<GValue>>,
  //
  >(
  target: GTarget,
  propertyName: GName,
  options?: ICreateMulticastReplayLastSourceOptions<GValue>,
): void {
  const input: IComponentInput<GValue> = createComponentInput<GValue>(options);

  objectDefineProperty(
    target,
    propertyName,
    {
      configurable: true,
      enumerable: true,
      get: (): IComponentInput<GValue> => {
        return input;
      },
      set: (
        value: GValue,
      ): void => {
        input.value = value;
      },
    },
  );
}

export function defineComponentInput$$< // generics
  GValue,
  GName extends string,
  GTarget extends Record<GName, IComponentInput<GValue>>,
  //
  >(
  target: GTarget,
  propertyName: GName,
  initialValue: GValue,
): void {
  defineComponentInput(target, propertyName, { initialValue });
}

export function defineComponentInputU$$< // generics
  GValue,
  GName extends string,
  GTarget extends Record<GName, IComponentInput<GValue>>,
  //
  >(
  target: GTarget,
  propertyName: GName,
): void {
  defineComponentInput<GValue, GName, GTarget>(target, propertyName);
}


// export function Input<GValue>(): PropertyDecorator {
//   return (target: Object, propertyKey: string | symbol): void => {
//     const map = new WeakMap<any, IComponentInput<GValue>>();
//
//     function get(this: any): IComponentInput<GValue> {
//       let value: IComponentInput<GValue> | undefined = map.get(this);
//       if (value === void 0) {
//         value = createComponentInput<GValue>();
//         map.set(this, value);
//       }
//       return value;
//     }
//
//     function set(
//       value: GValue,
//     ): void {
//       get().value = value;
//     }
//
//     objectDefineProperty(target, propertyKey, {
//       configurable: true,
//       enumerable: true,
//       get,
//       set,
//     });
//   };
// }

// export function Input<GValue>(
//   initialValue: GValue,
// ): PropertyDecorator {
//   return (target: Object, propertyKey: string | symbol): void => {
//     function get(this: any): IComponentInput<GValue> {
//       const input: IComponentInput<GValue> = createComponentInput<GValue>();
//
//       objectDefineProperty(target, propertyKey, {
//         configurable: true,
//         enumerable: true,
//         get: (): IComponentInput<GValue> => {
//           return input;
//         },
//         set,
//       });
//
//       return input;
//     }
//
//     function set(
//       value: GValue,
//     ): void {
//       get().value = value;
//     }
//
//     objectDefineProperty(target, propertyKey, {
//       configurable: true,
//       enumerable: true,
//       get,
//       set,
//     });
//   };
// }

export function Input<GValue>(
  ...args: ([GValue] | [])
): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {

    const bindInput = (
      target: any,
      input: IComponentInput<GValue>,
    ): void => {
      objectDefineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: (): IComponentInput<GValue> => {
          return input;
        },
        set: (
          value: GValue,
        ) => {
          input.value = value;
        },
      });
    };

    function get(
      this: any,
    ): IComponentInput<GValue> {
      const input: IComponentInput<GValue> = createComponentInput<GValue>(
        (args.length === 0)
          ? void 0
          :
          {
            initialValue: args[0],
          },
      );
      bindInput(this, input);
      return input;
    }

    function set(
      this: any,
      value: GValue,
    ): void {
      bindInput(
        this,
        createComponentInput<GValue>({ initialValue: value }),
      );
    }

    objectDefineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get,
      set,
    });
  };
}

