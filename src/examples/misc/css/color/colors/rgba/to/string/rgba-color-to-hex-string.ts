import { IReadonlyRGBAColor } from '../../rgba-color.type';
import { rgbaColorToHexNumber } from './rgba-color-to-hex-number';


export function rgbaColorToHexRRGGBBAAString(
  color: IReadonlyRGBAColor,
): string {
  return `#${ rgbaColorToHexNumber(color).toString(16).padStart(8, '0') }`;
}

export function rgbaColorToHexRRGGBBString(
  color: IReadonlyRGBAColor,
): string {
  return `#${ (rgbaColorToHexNumber(color) >>> 8).toString(16).padStart(6, '0') }`;
}

export function rgbaColorToHexString(
  color: IReadonlyRGBAColor,
): string {
  return (color.a === 1)
    ? rgbaColorToHexRRGGBBString(color)
    : rgbaColorToHexRRGGBBAAString(color);
}
