import { IReadonlyRGBAColor } from '../../rgba-color.type';
import { toPrecisionWithoutTrailingZeros } from '../../../../../../math/to-precision-without-trailing-zeros';
import { toPrecisionWithoutTrailingZerosForColorAlpha } from '../../../../../helpers/to-precision-without-trailing-zeros-for-color-alpha';

export function rgbaColorToRGBAString(
  color: IReadonlyRGBAColor,
  precision: number = 0,
): string {
  return `rgba(${ rgbaColorToRGBStringMembers(color, precision) }, ${ toPrecisionWithoutTrailingZerosForColorAlpha(color.a, precision) })`;
}

export function rgbaColorToRGBString(
  color: IReadonlyRGBAColor,
  precision?: number,
): string {
  return `rgb(${ rgbaColorToRGBStringMembers(color, precision) })`;
}

export function rgbaColorToRGB$AString(
  color: IReadonlyRGBAColor,
  precision?: number,
): string {
  return (color.a === 1)
    ? rgbaColorToRGBString(color, precision)
    : rgbaColorToRGBAString(color, precision);
}

/*----*/


function rgbaColorToRGBStringMembers(
  color: IReadonlyRGBAColor,
  precision: number = 0,
): string {
  return (precision === 0)
    ? `${ Math.round(color.r * 255) }, ${ Math.round(color.g * 255) }, ${ Math.round(color.b * 255) }`
    : `${ toPrecisionWithoutTrailingZeros(color.r * 255, precision) }, ${ toPrecisionWithoutTrailingZeros(color.g * 255, precision) }, ${ toPrecisionWithoutTrailingZeros(color.b * 255, precision) }`;
}

// function rgbaColorToRGBStringMembers(
//   color: IReadonlyRGBAColor,
//   precision: number = 5,
// ): string {
//   return `${ Math.round(color.r * 255) }, ${ Math.round(color.g * 255) }, ${ Math.round(color.b * 255) }`;
// }

// export function rgbaColorToRGBString(
//   color: IReadonlyRGBAColor,
//   alpha: boolean = false,
// ): string {
//   return `rgb${ alpha ? 'a' : '' }(${ Math.round(color.r * 255) }, ${ Math.round(color.g * 255) }, ${ Math.round(color.b * 255) }${ alpha ? (', ' + color.a) : '' })`;
// }

