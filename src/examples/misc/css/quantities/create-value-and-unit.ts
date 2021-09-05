import { IValueAndUnit } from './value-and-unit.type';

export function createValueAndUnit<GUnit extends string>(
  value: number,
  unit: GUnit,
): IValueAndUnit<any> {
  return {
    value,
    unit,
  };
}
