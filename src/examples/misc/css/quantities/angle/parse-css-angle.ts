import { IAngleValueAndUnit } from './angle-units.type';
import { resolveMultipleParsers } from '../../helpers/resolve-multiple-parsers';
import { parseCSSDegreesAsDegreesValueAndUnit } from './units/degrees/parse-css-degrees-as-degrees-value-and-unit';
import { parseCSSRadiansAsRadiansValueAndUnit } from './units/radians/parse-css-radians-as-radians-value-and-unit';
import { parseCSSTurnsAsTurnsValueAndUnit } from './units/turns/parse-css-turns-as-turns-value-and-unit';

// https://developer.mozilla.org/en-US/docs/Web/CSS/angle


export function parseCSSAngle(
  input: string,
): IAngleValueAndUnit | null {
  return resolveMultipleParsers<IAngleValueAndUnit>(input, [
    parseCSSDegreesAsDegreesValueAndUnit,
    parseCSSRadiansAsRadiansValueAndUnit,
    parseCSSTurnsAsTurnsValueAndUnit,
  ]);
}

