import { createValueAndUnit } from '../../../create-value-and-unit';
import { ITurnsValueAndUnit } from './turns-value-and-unit.type';
import { ITurnsUnit, TURNS_UNIT } from './turns-unit.constant';

export function createTurnsValueAndUnit(
  value: number
): ITurnsValueAndUnit {
  return createValueAndUnit<ITurnsUnit>(value, TURNS_UNIT);
}
