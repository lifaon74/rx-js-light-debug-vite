import { IReadonlyHSLAColor } from '../../hsla-color.type';
import { toPrecisionWithoutTrailingZeros } from '../../../../../../math/to-precision-without-trailing-zeros';
import { toPrecisionWithoutTrailingZerosForColorAlpha } from '../../../../../helpers/to-precision-without-trailing-zeros-for-color-alpha';
import { toFixedWithoutTrailingZeros } from '../../../../../../math/to-fixed-without-trailing-zeros';

export function hslaColorToHSLAString(
  color: IReadonlyHSLAColor,
  precision: number = 0,
): string {
  return `hsla(${ hslaColorToHSLStringMembers(color, precision) }, ${ toPrecisionWithoutTrailingZerosForColorAlpha(color.a, precision) })`;
}

export function hslaColorToHSLString(
  color: IReadonlyHSLAColor,
  precision?: number,
): string {
  return `hsl(${ hslaColorToHSLStringMembers(color, precision) })`;
}

export function hslaColorToHSL$AString(
  color: IReadonlyHSLAColor,
  precision?: number,
): string {
  return (color.a === 1)
    ? hslaColorToHSLString(color, precision)
    : hslaColorToHSLAString(color, precision);
}

/*----*/

function hslaColorToHSLStringMembers(
  color: IReadonlyHSLAColor,
  precision: number = 0,
): string {
  return (precision === 0)
  ? `${ Math.round(color.h * 360) }, ${ toFixedWithoutTrailingZeros(color.s * 100, 1) }%, ${ toFixedWithoutTrailingZeros(color.l * 100, 1) }%`
  : `${ toPrecisionWithoutTrailingZeros(color.h * 360, precision) }, ${ toPrecisionWithoutTrailingZeros(color.s * 100, precision) }%, ${ toPrecisionWithoutTrailingZeros(color.l * 100, precision) }%`;
}
