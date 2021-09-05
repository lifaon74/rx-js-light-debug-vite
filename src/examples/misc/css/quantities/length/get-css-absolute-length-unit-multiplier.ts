import { ICSSAbsoluteLengthUnit } from './css-absolute-length-unit.type';

/**
 *  unit => px
 */
export function getCSSAbsoluteLengthUnitMultiplier(
  unit: ICSSAbsoluteLengthUnit,
): number {
  switch (unit) {
    case 'cm':
      return 38;
    case 'mm':
      return 3.8;
    case 'Q':
      return 0.95;
    case 'in':
      return 96;
    case 'pc':
      return 16;
    case 'pt':
      return 96/72;
    case 'px':
      return 1;
    default:
      throw new Error(`Invalid css length unit: ${ unit }`);
  }
}
