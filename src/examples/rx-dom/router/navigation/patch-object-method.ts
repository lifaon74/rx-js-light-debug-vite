import { IGenericFunction } from '@lifaon/rx-js-light';
import { objectDefineProperty } from '@lifaon/rx-dom';

type IMethodNameConstraintRaw<GObject> = {
  [GKey in keyof GObject]: GObject[GKey] extends IGenericFunction
    ? GKey
    : never;
}

export type IMethodNameConstraint<GObject> =
  IMethodNameConstraintRaw<GObject>[keyof IMethodNameConstraintRaw<GObject>];

export interface IPatchObjectMethodFunction<GObject, GMethodName extends IMethodNameConstraint<GObject>> {
  (
    _this: any,
    native: GObject[GMethodName],
    ...args: Parameters<GObject[GMethodName]>
  ): ReturnType<GObject[GMethodName]>;
}

export function patchObjectMethod<// generics
  GObject,
  GMethodName extends IMethodNameConstraint<GObject>
  //
  >(
  obj: GObject,
  methodName: GMethodName,
  newFunction: IPatchObjectMethodFunction<GObject, GMethodName>,
): void {
  const native: GObject[GMethodName] = (obj[methodName] as IGenericFunction).bind(obj);

  const patched = function(this: unknown, ...args: Parameters<GObject[GMethodName]>): unknown {
    return newFunction(this, native, ...args);
  };

  objectDefineProperty(patched, 'name', {
    ...Object.getOwnPropertyDescriptor(patched, 'name'),
    value: methodName,
  });
  patched.toString = (native as IGenericFunction).toString.bind(native);

  obj[methodName] = patched as GObject[GMethodName];
}
