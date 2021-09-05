import { IHSLAColor } from './hsla-color.type';


export function createHSLAColor(
  h: number,
  s: number,
  l: number,
  a: number,
): IHSLAColor {
  return {
    h,
    s,
    l,
    a,
  };
}

