import { IHSLAColor } from './hsla-color.type';
import { IColor } from '../../color.type';

export function isHSLAColor(
  value: IColor,
): value is IHSLAColor {
  return (typeof (value as any).h === 'number')
  && (typeof (value as any).s === 'number')
  && (typeof (value as any).l === 'number')
  && (typeof (value as any).a === 'number');
}
