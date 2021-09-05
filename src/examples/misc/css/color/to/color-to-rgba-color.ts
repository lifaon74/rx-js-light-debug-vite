import { IColor } from '../color.type';
import { isRGBAColor } from '../colors/rgba/is-rgba.color';
import { isHSLAColor } from '../colors/hsla/is-hsla.color';
import { IRGBAColor } from '../colors/rgba/rgba-color.type';
import { hslaColorToRGBAColor } from '../colors/hsla/to/color/hsla-color-to-rgba-color';
import { isHSVAColor } from '../colors/hsva/is-hsva.color';
import { hsvaColorToRGBAColor } from '../colors/hsva/to/color/hsva-color-to-rgba-color';


export function colorToRGBAColor(
  color: IColor,
): IRGBAColor {
  if (isRGBAColor(color)) {
    return color;
  } else if (isHSLAColor(color)) {
    return hslaColorToRGBAColor(color);
  } else if (isHSVAColor(color)) {
    return hsvaColorToRGBAColor(color);
  } else {
    throw new Error(`Unknown color`);
  }
}
