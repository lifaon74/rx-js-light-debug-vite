import { IHSVAColor } from './hsva-color.type';


export function createHSVAColor(
  h: number,
  s: number,
  v: number,
  a: number,
): IHSVAColor {
  return {
    h,
    s,
    v,
    a,
  };
}

