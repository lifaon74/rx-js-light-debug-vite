import { IColor } from '../color.type';
import { isRGBAColor } from '../colors/rgba/is-rgba.color';
import { isHSLAColor } from '../colors/hsla/is-hsla.color';
import { isHSVAColor } from '../colors/hsva/is-hsva.color';
import { rgbaColorToHSVAColor } from '../colors/rgba/to/color/rgba-color-to-hsva-color';
import { hslaColorToHSVAColor } from '../colors/hsla/to/color/hsla-color-to-hsva-color';
import { IHSVAColor } from '../colors/hsva/hsva-color.type';


export function colorToHSVAColor(
  color: IColor,
): IHSVAColor {
  if (isRGBAColor(color)) {
    return rgbaColorToHSVAColor(color);
  } else if (isHSLAColor(color)) {
    return hslaColorToHSVAColor(color);
  } else if (isHSVAColor(color)) {
    return color;
  } else {
    throw new Error(`Unknown color`);
  }
}
