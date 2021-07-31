import { IStaticType } from '../static/static-type.type';
import { IInstanceOfType, IInterfaceType, IUnionType } from '../../webrtc.debug';
import { IPrimitiveTypeUnion } from '../shared/primitive-type-union.type';
import { IArrayType } from '../array/array-type.type';

export type IAnyTypeUnion =
  IPrimitiveTypeUnion
  | IStaticType
  | IInterfaceType
  | IInstanceOfType
  | IArrayType
  | IUnionType
  ;
