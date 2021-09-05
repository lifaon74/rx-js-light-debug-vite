import { IReadonlyHSLAColor } from '../../hsla-color.type';
import { hslaColorToRGBAColor } from '../color/hsla-color-to-rgba-color';
import { rgbaColorToHexRRGGBBAAString } from '../../../rgba/to/string/rgba-color-to-hex-string';

export function hslaColorToHexString(
  color: IReadonlyHSLAColor,
): string {
  return rgbaColorToHexRRGGBBAAString(hslaColorToRGBAColor(color));
}

