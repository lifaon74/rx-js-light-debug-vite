import { IReadonlyRGBAColor, IRGBAColor } from '../rgba-color.type';
import { createRGBAColor } from '../create-rgba-color';

export type IGrayScaleMode =
  'lightness'
  | 'average'
  | 'luminosity'; // (default)


export function grayscaleRGBAColor(
  color: IReadonlyRGBAColor,
  mode: IGrayScaleMode = 'luminosity',
): IRGBAColor {
  switch (mode) {
    case 'average':
      return grayscaleAverageRGBAColor(color);
    case 'lightness':
      return grayscaleLightnessRGBAColor(color);
    case 'luminosity':
      return grayscaleLuminosityRGBAColor(color);
    default:
      throw new TypeError(`Unexpected grayscale's mode: '${mode}'`);
  }
}


export function grayscaleAverageRGBAColor(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): IRGBAColor {
  const c: number = (r + g + b) / 3;
  return createRGBAColor(
    c,
    c,
    c,
    a,
  );
}

export function grayscaleLightnessRGBAColor(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): IRGBAColor {
  const c: number = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  return createRGBAColor(
    c,
    c,
    c,
    a,
  );
}

export function grayscaleLuminosityRGBAColor(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): IRGBAColor {
  const c: number = 0.21 * r + 0.72 * g + 0.07 * b;
  return createRGBAColor(
    c,
    c,
    c,
    a,
  );
}
