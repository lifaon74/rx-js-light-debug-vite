import { parseCSSNumber } from '../number/parse-css-number';
import { parseCSSAngle } from '../quantities/angle/parse-css-angle';
import { IAngleUnits, IAngleValueAndUnit } from '../quantities/angle/angle-units.type';
import { TURNS_UNIT } from '../quantities/angle/units/turns/turns-unit.constant';
import { ITurnsValueAndUnit } from '../quantities/angle/units/turns/turns-value-and-unit.type';
import { angleValueAndUnitToTurnsValueAndUnit } from '../quantities/angle/to/angle-value-and-unit-to-turns-value-and-unit';
import { DEGREES_UNIT } from '../quantities/angle/units/degrees/degrees-unit.constant';
import { RADIANS_UNIT } from '../quantities/angle/units/radians/radians-unit.constant';
import { createTurnsValueAndUnit } from '../quantities/angle/units/turns/create-turns-value-and-unit';
import { createDegreesValueAndUnit } from '../quantities/angle/units/degrees/create-degrees-value-and-unit';
import { createRadiansValueAndUnit } from '../quantities/angle/units/radians/create-radians-value-and-unit';
import { normalizeTurns } from '../quantities/angle/units/turns/operations/normalize-turns';

export function parseCSSAngleOrCSSNumberAsAngleValueAndUnit(
  input: string,
  defaultUnit: IAngleUnits,
): IAngleValueAndUnit | null {
  let value: IAngleValueAndUnit | number | null;
  if ((value = parseCSSAngle(input)) !== null) {
    return value;
  } else if ((value = parseCSSNumber(input)) !== null) {
    switch (defaultUnit) {
      case DEGREES_UNIT:
        return createDegreesValueAndUnit(value);
      case RADIANS_UNIT:
        return createRadiansValueAndUnit(value);
      case TURNS_UNIT:
        return createTurnsValueAndUnit(value);
    }
  } else {
    return null;
  }
}

export function parseCSSAngleOrCSSNumberAsTurnsValueAndUnit(
  input: string,
  defaultUnit: IAngleUnits,
): ITurnsValueAndUnit | null {
  const value: IAngleValueAndUnit | null = parseCSSAngleOrCSSNumberAsAngleValueAndUnit(input, defaultUnit);
  return (value === null)
    ? null
    : angleValueAndUnitToTurnsValueAndUnit(value);
}

export function parseCSSAngleOrCSSNumberAsNumberOfTurns(
  input: string,
  defaultUnit: IAngleUnits,
): number | null {
  const value: IAngleValueAndUnit | null = parseCSSAngleOrCSSNumberAsTurnsValueAndUnit(input, defaultUnit);
  return (value === null)
    ? null
    : value.value;
}

export function parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized(
  input: string,
  defaultUnit: IAngleUnits,
): number | null {
  const value: number | null = parseCSSAngleOrCSSNumberAsNumberOfTurns(input, defaultUnit);
  return (value === null)
    ? null
    : normalizeTurns(value);
}
