import { IStaticType } from './static-type.type';
import { IType } from '../shared/type.type';

export function isStaticType(
  value: IType,
): value is IStaticType {
  return (value.name === 'static');
}
