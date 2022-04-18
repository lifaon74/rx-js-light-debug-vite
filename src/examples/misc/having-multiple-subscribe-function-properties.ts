import {
  IGenericObservableProperty, IHavingMultipleObservableProperties,
  IObservablePropertiesToObservableSourceProperties,
  setComponentMultipleObservableProperties
} from '@lirx/dom';

// export type IHavingMultipleObservablePropertiesReturn<
//   // generics
//   GProperties extends readonly IGenericObservableProperty[],
//   GBaseClass extends (new(...args: any[]) => any)
//   //
//   > =
//   GBaseClass & IHavingMultipleObservableProperties<GProperties>
//   ;


export type IHavingMultipleObservablePropertiesReturn<
  // generics
  GProperties extends readonly IGenericObservableProperty[],
  GBaseClass extends (new(...args: any[]) => any)
  //
  > =
  GBaseClass
  & (new(properties: IObservablePropertiesToObservableSourceProperties<GProperties>, ...args: ConstructorParameters<GBaseClass>) => (InstanceType<GBaseClass> & IHavingMultipleObservableProperties<GProperties>));

/**
 * @deprecated
 */
export function havingMultipleObservableProperties<
  // generics
  GProperties extends readonly IGenericObservableProperty[],
  GBaseClass extends (new(...args: any[]) => any)
  //
  >(
  baseClass: GBaseClass
): IHavingMultipleObservablePropertiesReturn<GProperties, GBaseClass> {
  return class extends baseClass {
    constructor(...args: any[]) {
      super(...args.slice(1));
      setComponentMultipleObservableProperties<this, GProperties>(this, args[0]);
    }
  } as IHavingMultipleObservablePropertiesReturn<GProperties, GBaseClass>;
}
