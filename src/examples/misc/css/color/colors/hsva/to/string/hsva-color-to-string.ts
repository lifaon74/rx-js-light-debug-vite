import { IReadonlyHSVAColor } from '../../hsva-color.type';
import { hsvaColorToHSVAString } from './hsla-color-to-hsva-string';

export function hsvaColorToString(
  color: IReadonlyHSVAColor,
  precision?: number,
): string {
  return hsvaColorToHSVAString(color, precision);
}
