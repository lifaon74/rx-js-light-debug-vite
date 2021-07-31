import { IStaticType, IStaticTypeValue } from './static-type.type';

export function staticType(
  value: IStaticTypeValue,
): IStaticType {
  return {
    name: 'static',
    value,
  };
}
