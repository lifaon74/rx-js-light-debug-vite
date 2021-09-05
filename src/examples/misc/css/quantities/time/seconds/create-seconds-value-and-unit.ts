import { ISecondsValueAndUnit } from './seconds-value-and-unit.type';
import { createValueAndUnit } from '../../create-value-and-unit';

export function createSecondsValueAndUnit(
  value: number
): ISecondsValueAndUnit {
  return createValueAndUnit<'s'>(value, 's');
}
