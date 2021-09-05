import { IAngleValueAndUnit } from '../angle-units.type';
import { IDegreesValueAndUnit } from '../units/degrees/degrees-value-and-unit.type';
import { TURNS_UNIT } from '../units/turns/turns-unit.constant';
import { RADIANS_UNIT } from '../units/radians/radians-unit.constant';
import { DEGREES_UNIT } from '../units/degrees/degrees-unit.constant';
import { radiansValueAndUnitToDegreesValueAndUnit } from '../units/radians/to/radians-value-and-unit-to-degrees-value-and-unit';
import { turnsValueAndUnitToDegreesValueAndUnit } from '../units/turns/to/turns-value-and-unit-to-degrees-value-and-unit';


export function angleValueAndUnitToDegreesValueAndUnit(
  angle: IAngleValueAndUnit,
): IDegreesValueAndUnit {
  switch (angle.unit) {
    case DEGREES_UNIT:
      return angle;
    case RADIANS_UNIT:
      return radiansValueAndUnitToDegreesValueAndUnit(angle);
    case TURNS_UNIT:
      return turnsValueAndUnitToDegreesValueAndUnit(angle);
  }
}
