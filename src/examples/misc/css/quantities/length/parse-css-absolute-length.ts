import { getCSSAbsoluteLengthUnitMultiplier } from './get-css-absolute-length-unit-multiplier';
import { ICSSAbsoluteLengthUnit } from './css-absolute-length-unit.type';

// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units


const PARSE_CSS_LENGTH_REGEXP = new RegExp('^(.*)((?:cm)|(?:mm)|(?:Q)|(?:in)|(?:pc)|(?:pt)|(?:px))$');

export function parseCSSAbsoluteLength(
  input: string,
): number | null {
  const match: RegExpExecArray | null = PARSE_CSS_LENGTH_REGEXP.exec(input);
  if (match === null) {
    return null;
  } else {
    const value: number = parseFloat(match[1]);
    return Number.isNaN(value)
      ? null
      : (value * getCSSAbsoluteLengthUnitMultiplier(match[2] as ICSSAbsoluteLengthUnit));
  }
}


export function parseCSSAbsoluteLengthOrThrow(
  input: string,
): number {
  const value: number | null = parseCSSAbsoluteLength(input);
  if (value === null) {
    throw new Error(`Not a css length value`);
  } else {
    return value;
  }
}
