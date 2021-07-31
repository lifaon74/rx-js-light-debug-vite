import { ICSSSize } from './css-size.type';
import { ISize } from './size.type';

export function sizeToCSSSize(
  {
    width,
    height,
  }: ISize,
): ICSSSize {
  return {
    width: `${ width }px`,
    height: `${ height }px`,
  };
}
