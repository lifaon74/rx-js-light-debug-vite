import { IReadonlyHSVAColor } from '../../hsva-color.type';
import { rgbaColorToHexRRGGBBAAString } from '../../../rgba/to/string/rgba-color-to-hex-string';
import { hsvaColorToRGBAColor } from '../color/hsva-color-to-rgba-color';

export function hsvaColorToHexString(
  color: IReadonlyHSVAColor,
): string {
  return rgbaColorToHexRRGGBBAAString(hsvaColorToRGBAColor(color));
}
