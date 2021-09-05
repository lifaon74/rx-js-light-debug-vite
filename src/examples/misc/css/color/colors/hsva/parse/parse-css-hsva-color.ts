import { IHSVAColor } from '../hsva-color.type';
import { createHSVAColor } from '../create-hsva-color';
import { parseCSSNumberOrCSSPercentageAsNumber } from '../../../../helpers/parse-css-number-or-css-percentage-as-number';
import { parseCSSPercentage } from '../../../../percentage/parse-css-percentage';
import { parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized } from '../../../../helpers/parse-css-angle-or-css-number-as-number-of-turns';
import { DEGREES_UNIT } from '../../../../quantities/angle/units/degrees/degrees-unit.constant';
import { resolveMultipleParsers } from '../../../../helpers/resolve-multiple-parsers';


/** HSVA **/


const HSVA_REGEXP: RegExp = new RegExp(`^hsva\\((.*)\\)$`);

export function parseCSSHSVAColor(
  input: string,
): IHSVAColor | null {
  const match: RegExpExecArray | null = HSVA_REGEXP.exec(input);
  if (match !== null) {
    const members: string[] = match[1].split(',').map(_ => _.trim());
    if (members.length === 4) {
      const h: number | null = parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized(members[0], DEGREES_UNIT);
      if (h !== null) {
        const s: number | null = parseCSSPercentage(members[1]);
        if (isNonNullAndInTheRange0To100(s)) {
          const l: number | null = parseCSSPercentage(members[2]);
          if (isNonNullAndInTheRange0To100(l)) {
            const a: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[3], 1);
            if (isNonNullAndInTheRange0To1(a)) {
              return createHSVAColor(h, s / 100, l / 100, a);
            }
          }
        }
      }
    }
  }
  return null;
}

/** HSV **/


const HSV_REGEXP: RegExp = new RegExp(`^hsv\\((.*)\\)$`);

export function parseCSSHSVColor(
  input: string,
): IHSVAColor | null {
  const match: RegExpExecArray | null = HSV_REGEXP.exec(input);
  if (match !== null) {
    const members: string[] = match[1].split(',').map(_ => _.trim());
    if (members.length === 3) {
      const h: number | null = parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized(members[0], DEGREES_UNIT);
      if (h !== null) {
        const s: number | null = parseCSSPercentage(members[1]);
        if (isNonNullAndInTheRange0To100(s)) {
          const l: number | null = parseCSSPercentage(members[2]);
          if (isNonNullAndInTheRange0To100(l)) {
            return createHSVAColor(h, s / 100, l / 100, 1);
          }
        }
      }
    }
  }
  return null;
}

/** HSV[A] **/

export function parseCSSHSV$AColor(
  input: string,
): IHSVAColor | null {
  return resolveMultipleParsers<IHSVAColor>(input, [
    parseCSSHSVAColor,
    parseCSSHSVColor,
  ]);
}


/*----------------*/

function isNonNullAndInTheRange0To100(
  value: number | null
): value is number {
  return ((value !== null) && (0 <= value) && (value <= 100));
}

function isNonNullAndInTheRange0To1(
  value: number | null
): value is number {
  return ((value !== null) && (0 <= value) && (value <= 1));
}
