import { IReadonlyHSLAColor } from '../../hsla-color.type';
import { hslaColorToHSLAString } from './hsla-color-to-hsla-string';

export function hslaColorToString(
  color: IReadonlyHSLAColor,
  precision?: number,
): string {
  return hslaColorToHSLAString(color, precision);
}
