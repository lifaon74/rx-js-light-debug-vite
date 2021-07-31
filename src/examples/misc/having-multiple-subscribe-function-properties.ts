import {
  IGenericSubscribeFunctionProperty, IHavingMultipleSubscribeFunctionProperties,
  ISubscribeFunctionPropertiesToSubscribeFunctionSourceProperties,
  setComponentMultipleSubscribeFunctionProperties
} from '@lifaon/rx-dom';

// export type IHavingMultipleSubscribeFunctionPropertiesReturn<
//   // generics
//   GProperties extends readonly IGenericSubscribeFunctionProperty[],
//   GBaseClass extends (new(...args: any[]) => any)
//   //
//   > =
//   GBaseClass & IHavingMultipleSubscribeFunctionProperties<GProperties>
//   ;


export type IHavingMultipleSubscribeFunctionPropertiesReturn<
  // generics
  GProperties extends readonly IGenericSubscribeFunctionProperty[],
  GBaseClass extends (new(...args: any[]) => any)
  //
  > =
  GBaseClass
  & (new(properties: ISubscribeFunctionPropertiesToSubscribeFunctionSourceProperties<GProperties>, ...args: ConstructorParameters<GBaseClass>) => (InstanceType<GBaseClass> & IHavingMultipleSubscribeFunctionProperties<GProperties>));


export function havingMultipleSubscribeFunctionProperties<
  // generics
  GProperties extends readonly IGenericSubscribeFunctionProperty[],
  GBaseClass extends (new(...args: any[]) => any)
  //
  >(
  baseClass: GBaseClass
): IHavingMultipleSubscribeFunctionPropertiesReturn<GProperties, GBaseClass> {
  return class extends baseClass {
    constructor(...args: any[]) {
      super(...args.slice(1));
      setComponentMultipleSubscribeFunctionProperties<this, GProperties>(this, args[0]);
    }
  } as IHavingMultipleSubscribeFunctionPropertiesReturn<GProperties, GBaseClass>;
}
