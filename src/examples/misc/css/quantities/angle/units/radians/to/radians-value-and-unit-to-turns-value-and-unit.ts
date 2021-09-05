import { IRadiansValueAndUnit } from '../radians-value-and-unit.type';
import { ITurnsValueAndUnit } from '../../turns/turns-value-and-unit.type';
import { createTurnsValueAndUnit } from '../../turns/create-turns-value-and-unit';
import { radiansToTurns } from '../value/to/radians-to-turns';


export function radiansValueAndUnitToTurnsValueAndUnit(
  radians: IRadiansValueAndUnit,
): ITurnsValueAndUnit {
  return createTurnsValueAndUnit(radiansToTurns(radians.value));
}
