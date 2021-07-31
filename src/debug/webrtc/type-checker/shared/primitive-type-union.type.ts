import { IUndefinedType } from '../undefined/undefined-type.type';
import { INullType } from '../null/null-type.type';
import { ISymbolType } from '../symbol/symbol-type.type';
import { IStringType } from '../string/string-type.type';
import { INumberType } from '../number/number-type.type';
import { IBooleanType } from '../boolean/boolean-type.type';
import { IFunctionType } from '../function/function-type.type';

export type IPrimitiveTypeUnion =
  IUndefinedType
  | INullType
  | ISymbolType
  | IStringType
  | INumberType
  | IBooleanType
  | IFunctionType
  ;
