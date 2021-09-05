import { IAngleValueAndUnit } from '../angle-units.type';
import { TURNS_UNIT } from '../units/turns/turns-unit.constant';
import { RADIANS_UNIT } from '../units/radians/radians-unit.constant';
import { DEGREES_UNIT } from '../units/degrees/degrees-unit.constant';
import { ITurnsValueAndUnit } from '../units/turns/turns-value-and-unit.type';
import { radiansValueAndUnitToTurnsValueAndUnit } from '../units/radians/to/radians-value-and-unit-to-turns-value-and-unit';
import { degreesValueAndUnitToTurnsValueAndUnit } from '../units/degrees/to/degrees-value-and-unit-to-turns-value-and-unit';

export function angleValueAndUnitToTurnsValueAndUnit(
  angle: IAngleValueAndUnit,
): ITurnsValueAndUnit {
  switch (angle.unit) {
    case DEGREES_UNIT:
      return degreesValueAndUnitToTurnsValueAndUnit(angle);
    case RADIANS_UNIT:
      return radiansValueAndUnitToTurnsValueAndUnit(angle);
    case TURNS_UNIT:
      return angle;
  }
}
