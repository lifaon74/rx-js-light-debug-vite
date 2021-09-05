import { IHSLAColor } from '../../../hsla/hsla-color.type';
import { IReadonlyHSVAColor } from '../../hsva-color.type';
import { rgbaColorToHSLAColor } from '../../../rgba/to/color/rgba-color-to-hsla-color';
import { hsvaColorToRGBAColor } from './hsva-color-to-rgba-color';

// https://gist.github.com/xpansive/1337890

// TODO improve

export function hsvaColorToHSLAColor(
  color: IReadonlyHSVAColor,
): IHSLAColor {
  return rgbaColorToHSLAColor(hsvaColorToRGBAColor(color));
}


