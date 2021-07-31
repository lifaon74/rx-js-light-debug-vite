import { IType } from '../shared/type.type';

export type IStaticTypeValue = string | number;

export interface IStaticType extends IType {
  name: 'static';
  value: IStaticTypeValue;
}

