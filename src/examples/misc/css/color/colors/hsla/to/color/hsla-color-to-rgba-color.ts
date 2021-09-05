import { IReadonlyHSLAColor } from '../../hsla-color.type';
import { IRGBAColor } from '../../../rgba/rgba-color.type';
import { createRGBAColor } from '../../../rgba/create-rgba-color';

export function hslaColorToRGBAColor(
  color: IReadonlyHSLAColor,
): IRGBAColor {
  const h: number = color.h;
  const s: number = color.s;
  const l: number = color.l;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;
    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);
  }

  return createRGBAColor(
    r,
    g,
    b,
    color.a,
  );
}


/*----*/

function hueToRGB(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
