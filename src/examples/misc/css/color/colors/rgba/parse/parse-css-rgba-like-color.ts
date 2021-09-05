import { IRGBAColor } from '../rgba-color.type';
import { resolveMultipleParsers } from '../../../../helpers/resolve-multiple-parsers';
import { parseCSSHexColor } from './parse-css-hex-color';
import { parseCSSRGB$AColor } from './parse-css-rgba-color';


export function parseCSSRGBALikeColor(
  input: string,
): IRGBAColor | null {
  return resolveMultipleParsers<IRGBAColor>(input, [
    parseCSSRGB$AColor,
    parseCSSHexColor,
  ]);
}

