import { IHSLAColor } from '../colors/hsla/hsla-color.type';
import { IColor } from '../color.type';
import { isRGBAColor } from '../colors/rgba/is-rgba.color';
import { rgbaColorToHSLAColor } from '../colors/rgba/to/color/rgba-color-to-hsla-color';
import { isHSLAColor } from '../colors/hsla/is-hsla.color';
import { hsvaColorToHSLAColor } from '../colors/hsva/to/color/hsva-color-to-hsla-color';
import { isHSVAColor } from '../colors/hsva/is-hsva.color';


export function colorToHSLAColor(
  color: IColor,
): IHSLAColor {
  if (isRGBAColor(color)) {
    return rgbaColorToHSLAColor(color);
  } else if (isHSLAColor(color)) {
    return color;
  } else if (isHSVAColor(color)) {
    return hsvaColorToHSLAColor(color);
  } else {
    throw new Error(`Unknown color`);
  }
}
