import { IReadonlyRGBAColor } from '../../rgba-color.type';

export function rgbaColorToHexNumber(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): number {
  return (
    (Math.round(r * 255) << 24)
    | (Math.round(g * 255) << 16)
    | (Math.round(b * 255) << 8)
    | Math.round(a * 255)
  ) >>> 0;
}

