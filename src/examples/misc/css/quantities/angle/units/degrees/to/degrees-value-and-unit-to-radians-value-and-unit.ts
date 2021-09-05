import { IDegreesValueAndUnit } from '../degrees-value-and-unit.type';
import { IRadiansValueAndUnit } from '../../radians/radians-value-and-unit.type';
import { createRadiansValueAndUnit } from '../../radians/create-radians-value-and-unit';
import { degreesToRadians } from '../value/to/degrees-to-radians';


export function degreesValueAndUnitToRadiansValueAndUnit(
  degrees: IDegreesValueAndUnit,
): IRadiansValueAndUnit {
  return createRadiansValueAndUnit(degreesToRadians(degrees.value));
}
