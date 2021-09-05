import { IAngleValueAndUnit } from '../angle-units.type';
import { TURNS_UNIT } from '../units/turns/turns-unit.constant';
import { RADIANS_UNIT } from '../units/radians/radians-unit.constant';
import { turnsValueAndUnitToRadiansValueAndUnit } from '../units/turns/to/turns-value-and-unit-to-radians-value-and-unit';
import { DEGREES_UNIT } from '../units/degrees/degrees-unit.constant';
import { IRadiansValueAndUnit } from '../units/radians/radians-value-and-unit.type';
import { degreesValueAndUnitToRadiansValueAndUnit } from '../units/degrees/to/degrees-value-and-unit-to-radians-value-and-unit';

export function angleValueAndUnitToRadiansValueAndUnit(
  angle: IAngleValueAndUnit,
): IRadiansValueAndUnit {
  switch (angle.unit) {
    case DEGREES_UNIT:
      return degreesValueAndUnitToRadiansValueAndUnit(angle);
    case RADIANS_UNIT:
      return angle;
    case TURNS_UNIT:
      return turnsValueAndUnitToRadiansValueAndUnit(angle);
  }
}
