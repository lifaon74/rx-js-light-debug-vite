import { ITurnsValueAndUnit } from '../turns-value-and-unit.type';
import { IRadiansValueAndUnit } from '../../radians/radians-value-and-unit.type';
import { createRadiansValueAndUnit } from '../../radians/create-radians-value-and-unit';
import { turnsToRadians } from '../value/to/turns-to-radians';


export function turnsValueAndUnitToRadiansValueAndUnit(
  turns: ITurnsValueAndUnit,
): IRadiansValueAndUnit {
  return createRadiansValueAndUnit(turnsToRadians(turns.value));
}
