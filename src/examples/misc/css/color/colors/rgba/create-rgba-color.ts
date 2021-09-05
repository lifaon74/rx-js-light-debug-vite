import { IRGBAColor } from './rgba-color.type';


export function createRGBAColor(
  r: number,
  g: number,
  b: number,
  a: number,
): IRGBAColor {
  return {
    r,
    g,
    b,
    a,
  };
}

