import { ITimeUnitAndValue } from './time-units.type';
import { parseCSSSecondsAsSecondsValueAndUnit } from './seconds/parse-css-seconds-as-seconds-value-and-unit';
import { parseCSSMillisecondsAsMillisecondsValueAndUnit } from './milliseconds/parse-css-milliseconds-as-milliseconds-value-and-unit';
import { resolveMultipleParsers } from '../../helpers/resolve-multiple-parsers';

// https://developer.mozilla.org/en-US/docs/Web/CSS/time


export function parseCSSTime(
  input: string,
): ITimeUnitAndValue | null {
  return resolveMultipleParsers<ITimeUnitAndValue>(input, [
    parseCSSSecondsAsSecondsValueAndUnit,
    parseCSSMillisecondsAsMillisecondsValueAndUnit,
  ]);
}

