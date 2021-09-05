import { IRadiansValueAndUnit } from '../radians-value-and-unit.type';
import { IDegreesValueAndUnit } from '../../degrees/degrees-value-and-unit.type';
import { createDegreesValueAndUnit } from '../../degrees/create-degrees-value-and-unit';
import { radiansToDegrees } from '../value/to/radians-to-degrees';


export function radiansValueAndUnitToDegreesValueAndUnit(
  radians: IRadiansValueAndUnit,
): IDegreesValueAndUnit {
  return createDegreesValueAndUnit(radiansToDegrees(radians.value));
}
