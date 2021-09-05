import { ITurnsValueAndUnit } from '../turns-value-and-unit.type';
import { IDegreesValueAndUnit } from '../../degrees/degrees-value-and-unit.type';
import { createDegreesValueAndUnit } from '../../degrees/create-degrees-value-and-unit';
import { turnsToDegrees } from '../value/to/turns-to-degrees';


export function turnsValueAndUnitToDegreesValueAndUnit(
  turns: ITurnsValueAndUnit,
): IDegreesValueAndUnit {
  return createDegreesValueAndUnit(turnsToDegrees(turns.value));
}
