import { IReadonlyRGBAColor } from '../../rgba-color.type';
import { IHSVAColor } from '../../../hsva/hsva-color.type';
import { createHSVAColor } from '../../../hsva/create-hsva-color';

export function rgbaColorToHSVAColor(
  {
    r,
    g,
    b,
    a,
  }: IReadonlyRGBAColor,
): IHSVAColor {
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);

  let h!: number, s: number, v: number = max;

  if (max === min) { // achromatic
    h = 0;
    s = 0;
  } else {
    const d: number = max - min;
    s = (max === 0) ? 0 : (d / max);
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


  return createHSVAColor(
    h,
    s,
    v,
    a,
  );
}

