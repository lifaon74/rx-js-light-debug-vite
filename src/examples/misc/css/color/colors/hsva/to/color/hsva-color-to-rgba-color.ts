import { IReadonlyHSVAColor } from '../../hsva-color.type';
import { IRGBAColor } from '../../../rgba/rgba-color.type';
import { createRGBAColor } from '../../../rgba/create-rgba-color';

export function hsvaColorToRGBAColor(
  {
    h,
    s,
    v,
    a,
  }: IReadonlyHSVAColor,
): IRGBAColor {
  let r!: number, g!: number, b!: number;

  const i: number = Math.floor(h * 6);
  const f: number = h * 6 - i;
  const p: number = v * (1 - s);
  const q: number = v * (1 - f * s);
  const t: number = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return createRGBAColor(
    r,
    g,
    b,
    a,
  );
}


