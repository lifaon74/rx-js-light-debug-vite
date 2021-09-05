import { IRGBAColor } from '../rgba-color.type';
import { createRGBAColor } from '../create-rgba-color';
import { parseCSSNumberOrCSSPercentageAsNumber } from '../../../../helpers/parse-css-number-or-css-percentage-as-number';
import { resolveMultipleParsers } from '../../../../helpers/resolve-multiple-parsers';


/** RGBA **/

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgba()

const RGBA_REGEXP: RegExp = new RegExp(`^rgba\\((.*)\\)$`);

export function parseCSSRGBAColor(
  input: string,
): IRGBAColor | null {
  const match: RegExpExecArray | null = RGBA_REGEXP.exec(input);
  if (match !== null) {
    const members: string[] = match[1].split(',').map(_ => _.trim());
    if (members.length === 4) {
      const r: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[0], 255);
      if (isNonNullAndInTheRange0To255(r)) {
        const g: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[1], 255);
        if (isNonNullAndInTheRange0To255(g)) {
          const b: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[2], 255);
          if (isNonNullAndInTheRange0To255(b)) {
            const a: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[3], 1);
            if (isNonNullAndInTheRange0To1(a)) {
              return createRGBAColor(r / 255, g / 255, b / 255, a);
            }
          }
        }
      }

    }
  }
  return null;
}

/** RGB **/

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb()

const RGB_REGEXP: RegExp = new RegExp(`^rgb\\((.*)\\)$`);

export function parseCSSRGBColor(
  input: string,
): IRGBAColor | null {
  const match: RegExpExecArray | null = RGB_REGEXP.exec(input);
  if (match !== null) {
    const members: string[] = match[1].split(',').map(_ => _.trim());
    if (members.length === 3) {
      const r: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[0], 255);
      if (isNonNullAndInTheRange0To255(r)) {
        const g: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[1], 255);
        if (isNonNullAndInTheRange0To255(g)) {
          const b: number | null = parseCSSNumberOrCSSPercentageAsNumber(members[2], 255);
          if (isNonNullAndInTheRange0To255(b)) {
            return createRGBAColor(r / 255, g / 255, b / 255, 1);

          }
        }
      }

    }
  }
  return null;
}

/** RGB[A] **/

export function parseCSSRGB$AColor(
  input: string,
): IRGBAColor | null {
  return resolveMultipleParsers<IRGBAColor>(input, [
    parseCSSRGBAColor,
    parseCSSRGBColor,
  ]);
}


/*----------------*/

function isNonNullAndInTheRange0To255(
  value: number | null
): value is number {
  return ((value !== null) && (0 <= value) && (value <= 255));
}

function isNonNullAndInTheRange0To1(
  value: number | null
): value is number {
  return ((value !== null) && (0 <= value) && (value <= 1));
}
