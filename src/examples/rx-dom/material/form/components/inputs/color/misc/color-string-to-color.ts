import { IColor } from '../../../../../../../misc/css/color/color.type';
import { parseCSSColor } from '../../../../../../../misc/css/color/parse-css-color';
import { DEFAULT_MAT_COLOR_INPUT_COLOR } from './default-mat-color-input-color.constant';

export function colorStringToColor(colorString: string): IColor {
  const color: IColor | null = parseCSSColor(colorString);
  return (color === null)
    ? DEFAULT_MAT_COLOR_INPUT_COLOR
    : color;
}
