import { IHSLAColor, IReadonlyHSLAColor } from '../hsla-color.type';
import { lightenHSLAColor } from './lighten-hsla-color';

export function darkenHSLAColor(
  color: IReadonlyHSLAColor,
  amount: number,
): IHSLAColor {
  return lightenHSLAColor(color, -amount);
}
