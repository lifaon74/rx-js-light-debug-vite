// https://developer.mozilla.org/en-US/docs/Web/CSS/time

const PARSE_CSS_TIME_REGEXP = new RegExp('^(.*)((?:ms)|(?:s))$');

export function parseCSSTime(
  time: string,
): number | null {
  const match: RegExpExecArray | null = PARSE_CSS_TIME_REGEXP.exec(time);
  if (match === null) {
    return null;
  } else {
    const time: number = parseFloat(match[1]);
    const multiplier: number = (match[2] === 's') ? 1000 : 1;
    return Number.isNaN(time)
      ? null
      : (time * multiplier);
  }
}
