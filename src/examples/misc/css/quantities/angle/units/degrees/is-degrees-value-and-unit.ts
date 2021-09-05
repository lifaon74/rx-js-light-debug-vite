import { IGenericValueAndUnit } from '../../../value-and-unit.type';
import { IDegreesValueAndUnit } from './degrees-value-and-unit.type';
import { DEGREES_UNIT } from './degrees-unit.constant';

export function isDegreesValueAndUnit(
  value: IGenericValueAndUnit,
): value is IDegreesValueAndUnit {
  return (value.unit === DEGREES_UNIT);
}
