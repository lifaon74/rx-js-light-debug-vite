
// https://developer.mozilla.org/en-US/docs/Web/CSS/dimension

export interface IValueAndUnit<GUnit extends string> {
  value: number;
  unit: GUnit;
}


/*------*/

export type IGenericValueAndUnit = IValueAndUnit<string>;

export type IInferValueAndUnitGUnit<GValueAndUnit extends IGenericValueAndUnit> =
  GValueAndUnit extends IValueAndUnit<infer GUnit>
    ? GUnit
    : never;
