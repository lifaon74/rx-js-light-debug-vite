import { IReadonlyRGBAColor } from '../../rgba-color.type';
import { IHSLAColor } from '../../../hsla/hsla-color.type';
import { createHSLAColor } from '../../../hsla/create-hsla-color';

export function rgbaColorToHSLAColor(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): IHSLAColor {
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);

  let h!: number, s: number, l: number = (max + min) / 2;

  if (max === min) { // achromatic
    h = 0;
    s = 0;
  } else {
    const d: number = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return createHSLAColor(
    h,
    s,
    l,
    a,
  );
}

