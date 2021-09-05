import { IColor } from '../../color.type';
import { IRGBAColor } from './rgba-color.type';

export function isRGBAColor(
  value: IColor,
): value is IRGBAColor {
  return (typeof (value as any).r === 'number')
  && (typeof (value as any).g === 'number')
  && (typeof (value as any).b === 'number')
  && (typeof (value as any).a === 'number');
}
