import { IAnyTypeUnion } from './any-type-union.type';
import { isStaticType } from '../static/is-static-type';
import { verifyStaticType } from '../static/verify-static-type';
import { isUndefinedType } from '../undefined/is-undefined-type';
import { verifyUndefinedType } from '../undefined/verify-undefined-type';
import { isNullType } from '../null/is-null-type';
import { verifyNullType } from '../null/verify-null-type';
import { isSymbolType } from '../symbol/is-symbol-type';
import { verifySymbolType } from '../symbol/verify-symbol-type';
import { isStringType } from '../string/is-string-type';
import { verifyStringType } from '../string/verify-string-type';
import { isNumberType } from '../number/is-number-type';
import { verifyNumberType } from '../number/verify-number-type';
import { isBooleanType } from '../boolean/is-boolean-type';
import { verifyBooleanType } from '../boolean/verify-boolean-type';
import { isFunctionType } from '../function/is-function-type';
import { verifyFunctionType } from '../function/verify-function-type';
import { isArrayType } from '../array/is-array-type';
import { verifyArrayType } from '../array/verify-array-type';
import { isInterfaceType } from '../interface/is-interface-type';
import { verifyInterfaceType } from '../interface/verify/verify-interface-type';
import { isInstanceOfType } from '../instance-of/is-instance-of';
import { verifyInstanceOfType } from '../instance-of/verify-instance-of';
import { isUnionType } from '../union/is-union-type';
import { verifyUnionType } from '../union/verify-union-type';
import { IType } from '../shared/type.type';
import { createMemory, IMemory } from '../shared/create-memory';

export function verifyType(
  value: unknown,
  variableName: string,
  type: IAnyTypeUnion,
  // memory: IMemory,
  memory: IMemory = createMemory(),
): void {
  if (
    (typeof value === 'object')
    && (value !== null)
  ) {
    if (memory.has(value)) {
      return;
    } else {
      memory.add(value);
    }
  }

  if (isStaticType(type)) {
    verifyStaticType(value, variableName, type);
  } else if (isUndefinedType(type)) {
    verifyUndefinedType(value, variableName);
  } else if (isNullType(type)) {
    verifyNullType(value, variableName);
  } else if (isSymbolType(type)) {
    verifySymbolType(value, variableName);
  } else if (isStringType(type)) {
    verifyStringType(value, variableName);
  } else if (isNumberType(type)) {
    verifyNumberType(value, variableName);
  } else if (isBooleanType(type)) {
    verifyBooleanType(value, variableName);
  } else if (isFunctionType(type)) {
    verifyFunctionType(value, variableName);
  } else if (isArrayType(type)) {
    verifyArrayType(value, variableName, type, memory);
  } else if (isInterfaceType(type)) {
    verifyInterfaceType(value, variableName, type, memory);
  } else if (isInstanceOfType(type)) {
    verifyInstanceOfType(value, variableName, type);
  } else if (isUnionType(type)) {
    verifyUnionType(value, variableName, type, memory);
  } else {
    throw new Error(`Unknown type: ${ (type as IType).name }`);
  }
}
