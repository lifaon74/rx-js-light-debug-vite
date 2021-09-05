import { IColor } from '../../color.type';
import { IHSVAColor } from './hsva-color.type';

export function isHSVAColor(
  value: IColor,
): value is IHSVAColor {
  return (typeof (value as any).h === 'number')
  && (typeof (value as any).s === 'number')
  && (typeof (value as any).v === 'number')
  && (typeof (value as any).a === 'number');
}
