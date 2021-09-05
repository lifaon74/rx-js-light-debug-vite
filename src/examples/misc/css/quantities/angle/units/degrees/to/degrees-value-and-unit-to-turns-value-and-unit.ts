import { IDegreesValueAndUnit } from '../degrees-value-and-unit.type';
import { ITurnsValueAndUnit } from '../../turns/turns-value-and-unit.type';
import { createTurnsValueAndUnit } from '../../turns/create-turns-value-and-unit';
import { degreesToTurns } from '../value/to/degrees-to-turns';


export function degreesValueAndUnitToTurnsValueAndUnit(
  degrees: IDegreesValueAndUnit,
): ITurnsValueAndUnit {
  return createTurnsValueAndUnit(degreesToTurns(degrees.value));
}
