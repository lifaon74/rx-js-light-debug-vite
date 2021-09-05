import { IHSLAColor } from '../hsla-color.type';
import { createHSLAColor } from '../create-hsla-color';
import { parseCSSNumberOrCSSPercentageAsNumber } from '../../../../helpers/parse-css-number-or-css-percentage-as-number';
import { parseCSSPercentage } from '../../../../percentage/parse-css-percentage';
import { parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized } from '../../../../helpers/parse-css-angle-or-css-number-as-number-of-turns';
import { DEGREES_UNIT } from '../../../../quantities/angle/units/degrees/degrees-unit.constant';
import { resolveMultipleParsers } from '../../../../helpers/resolve-multiple-parsers';


/** HSLA **/

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsla()

const HSLA_REGEXP: RegExp = new RegExp(`^hsla\\((.*)\\)$`);

export function parseCSSHSLAColor(
  input: string,
): IHSLAColor | null {
  const match: RegExpExecArray | null = HSLA_REGEXP.exec(input);
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
              return createHSLAColor(h, s / 100, l / 100, a);
            }
          }
        }
      }
    }
  }
  return null;
}

/** HSL **/

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl()

const HSL_REGEXP: RegExp = new RegExp(`^hsl\\((.*)\\)$`);

export function parseCSSHSLColor(
  input: string,
): IHSLAColor | null {
  const match: RegExpExecArray | null = HSL_REGEXP.exec(input);
  if (match !== null) {
    const members: string[] = match[1].split(',').map(_ => _.trim());
    if (members.length === 3) {
      const h: number | null = parseCSSAngleOrCSSNumberAsNumberOfTurnsNormalized(members[0], DEGREES_UNIT);
      if (h !== null) {
        const s: number | null = parseCSSPercentage(members[1]);
        if (isNonNullAndInTheRange0To100(s)) {
          const l: number | null = parseCSSPercentage(members[2]);
          if (isNonNullAndInTheRange0To100(l)) {
            return createHSLAColor(h, s / 100, l / 100, 1);
          }
        }
      }
    }
  }
  return null;
}

/** HSL[A] **/

export function parseCSSHSL$AColor(
  input: string,
): IHSLAColor | null {
  return resolveMultipleParsers<IHSLAColor>(input, [
    parseCSSHSLAColor,
    parseCSSHSLColor,
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
