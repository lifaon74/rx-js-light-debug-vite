import { IHSLAColor, IReadonlyHSLAColor } from '../hsla-color.type';
import { createHSLAColor } from '../create-hsla-color';

export function lightenHSLAColor(
  {
    h,
    s,
    l,
    a,
  }: IReadonlyHSLAColor,
  amount: number,
): IHSLAColor {
  return createHSLAColor(
    h,
    s,
    Math.max(0, Math.min(1, l + amount)),
    a,
  );
}
