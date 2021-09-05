import { toPrecisionWithoutTrailingZeros } from '../../../../../../math/to-precision-without-trailing-zeros';
import { IReadonlyHSVAColor } from '../../hsva-color.type';
import { toPrecisionWithoutTrailingZerosForColorAlpha } from '../../../../../helpers/to-precision-without-trailing-zeros-for-color-alpha';
import { toFixedWithoutTrailingZeros } from '../../../../../../math/to-fixed-without-trailing-zeros';

export function hsvaColorToHSVAString(
  color: IReadonlyHSVAColor,
  precision: number = 0,
): string {
  return `hsva(${ hsvaColorToHSVStringMembers(color, precision) }, ${ toPrecisionWithoutTrailingZerosForColorAlpha(color.a, precision) })`;
}

export function hsvaColorToHSVString(
  color: IReadonlyHSVAColor,
  precision?: number,
): string {
  return `hsv(${ hsvaColorToHSVStringMembers(color, precision) })`;
}

export function hsvaColorToHSV$AString(
  color: IReadonlyHSVAColor,
  precision?: number,
): string {
  return (color.a === 1)
    ? hsvaColorToHSVString(color, precision)
    : hsvaColorToHSVAString(color, precision);
}

/*----*/

function hsvaColorToHSVStringMembers(
  color: IReadonlyHSVAColor,
  precision: number = 4,
): string {
  return (precision === 0)
    ? `${ Math.round(color.h * 360) }, ${ toFixedWithoutTrailingZeros(color.s * 100, 1) }%, ${ toFixedWithoutTrailingZeros(color.v * 100, 1) }%`
    : `${ toPrecisionWithoutTrailingZeros(color.h * 360, precision) }, ${ toPrecisionWithoutTrailingZeros(color.s * 100, precision) }%, ${ toPrecisionWithoutTrailingZeros(color.v * 100, precision) }%`;
}


