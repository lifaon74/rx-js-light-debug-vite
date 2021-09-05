import { IMillisecondsValueAndUnit } from './milliseconds-value-and-unit.type';
import { createValueAndUnit } from '../../create-value-and-unit';

export function createMillisecondsValueAndUnit(
  value: number
): IMillisecondsValueAndUnit {
  return createValueAndUnit<'ms'>(value, 'ms');
}
