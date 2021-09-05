import { IReadonlyRGBAColor } from '../../rgba-color.type';
import { rgbaColorToRGBAString } from './rgba-color-to-rgba-string';

export function rgbaColorToString(
  color: IReadonlyRGBAColor,
  precision?: number,
): string {
  return rgbaColorToRGBAString(color, precision);
}
