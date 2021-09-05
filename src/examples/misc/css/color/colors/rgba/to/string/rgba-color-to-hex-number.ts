import { IReadonlyRGBAColor } from '../../rgba-color.type';

export function rgbaColorToHexNumber(
  color: IReadonlyRGBAColor,
): number {
  return (
    (Math.round(color.r * 255) << 24)
    | (Math.round(color.g * 255) << 16)
    | (Math.round(color.b * 255) << 8)
    | Math.round(color.a * 255)
  ) >>> 0;
}

