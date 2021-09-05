import { resolveMultipleParsers } from '../helpers/resolve-multiple-parsers';
import { IColor } from './color.type';
import { parseCSSRGBALikeColor } from './colors/rgba/parse/parse-css-rgba-like-color';
import { parseCSSHSL$AColor } from './colors/hsla/parse/parse-css-hsla-color';
import { parseCSSHSV$AColor } from './colors/hsva/parse/parse-css-hsva-color';

export function parseCSSColor(
  input: string,
): IColor | null {
  return resolveMultipleParsers<IColor>(input, [
    parseCSSRGBALikeColor,
    parseCSSHSL$AColor,
    parseCSSHSV$AColor,
    parseCSSKeywordColor,
  ]);
}


function parseCSSKeywordColor(
  input: string,
): IColor | null {
  const element: HTMLElement = document.createElement('div');
  element.style.setProperty('color', input);

  if (element.style.getPropertyValue('color')) {
    document.body.appendChild(element);
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const rgbColor: string = style.color;
    document.body.removeChild(element);
    return parseCSSRGBALikeColor(rgbColor);
  } else {
    return null;
  }
}

