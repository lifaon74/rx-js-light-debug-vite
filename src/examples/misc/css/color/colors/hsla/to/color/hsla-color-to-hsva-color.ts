import { IReadonlyHSLAColor } from '../../hsla-color.type';
import { IHSVAColor } from '../../../hsva/hsva-color.type';
import { rgbaColorToHSVAColor } from '../../../rgba/to/color/rgba-color-to-hsva-color';
import { hslaColorToRGBAColor } from './hsla-color-to-rgba-color';

// https://gist.github.com/xpansive/1337890

// TODO improve

export function hslaColorToHSVAColor(
  color: IReadonlyHSLAColor,
): IHSVAColor {
  return rgbaColorToHSVAColor(hslaColorToRGBAColor(color));
}


