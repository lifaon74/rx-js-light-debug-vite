import { createValueAndUnit } from '../../../create-value-and-unit';
import { IRadiansValueAndUnit } from './radians-value-and-unit.type';
import { IRadiansUnit, RADIANS_UNIT } from './radians-unit.constant';

export function createRadiansValueAndUnit(
  value: number
): IRadiansValueAndUnit {
  return createValueAndUnit<IRadiansUnit>(value, RADIANS_UNIT);
}
