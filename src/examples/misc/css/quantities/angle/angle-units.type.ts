import { IDegreesValueAndUnit } from './units/degrees/degrees-value-and-unit.type';
import { IRadiansValueAndUnit } from './units/radians/radians-value-and-unit.type';
import { ITurnsValueAndUnit } from './units/turns/turns-value-and-unit.type';
import { IInferValueAndUnitGUnit } from '../value-and-unit.type';


export type IAngleValueAndUnit =
  IDegreesValueAndUnit
  | IRadiansValueAndUnit
  | ITurnsValueAndUnit
  ;

export type IAngleUnits = IInferValueAndUnitGUnit<IAngleValueAndUnit>;
