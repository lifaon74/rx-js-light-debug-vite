import { createValueAndUnit } from '../../../create-value-and-unit';
import { IDegreesValueAndUnit } from './degrees-value-and-unit.type';
import { DEGREES_UNIT, IDegreesUnit } from './degrees-unit.constant';

export function createDegreesValueAndUnit(
  value: number
): IDegreesValueAndUnit {
  return createValueAndUnit<IDegreesUnit>(value, DEGREES_UNIT);
}
