import { IStaticType } from '../static/static-type.type';
import { IPrimitiveTypeUnion } from '../shared/primitive-type-union.type';
import { IArrayType } from '../array/array-type.type';
import { IInterfaceType } from '../interface/interface-type.type';
import { IUnionType } from '../union/union-type.type';
import { IInstanceOfType } from '../instance-of/instance-of.type';

export type IAnyTypeUnion =
  IPrimitiveTypeUnion
  | IStaticType
  | IInterfaceType
  | IInstanceOfType
  | IArrayType
  | IUnionType
  ;
