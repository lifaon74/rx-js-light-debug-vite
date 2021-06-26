function createTypeError(
  variableName: string,
  message: string,
): TypeError {
  return new TypeError(`for ${ variableName }: ${ message }`);
}

function throwTypeError(
  variableName: string,
  message: string,
): never {
  throw createTypeError(variableName, message);
}

function throwExpectedTypeError(
  variableName: string,
  type: string,
): never {
  throwTypeError(variableName, `expected ${ type }`);
}


/*------*/

/* TYPE */

interface IType {
  name: string;
}

/* STATIC */

type IStaticTypeValue = string | number;

interface IStaticType extends IType {
  name: 'static';
  value: IStaticTypeValue;
}

function isStaticType(
  value: IType,
): value is IStaticType {
  return (value.name === 'static');
}

function staticType(
  value: IStaticTypeValue,
): IStaticType {
  return {
    name: 'static',
    value,
  };
}

function verifyStaticType(
  value: unknown,
  variableName: string,
  type: IStaticType,
): void {
  if (value !== type.value) {
    throwExpectedTypeError(variableName, `${ type.value } (static)`);
  }
}

/* UNDEFINED */

interface IUndefinedType extends IType {
  name: 'undefined';
}

function isUndefinedType(
  value: IType,
): value is IUndefinedType {
  return (value.name === 'undefined');
}

function undefinedType(): IUndefinedType {
  return {
    name: 'undefined',
  };
}

function verifyUndefinedType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'undefined') {
    throwExpectedTypeError(variableName, 'undefined');
  }
}

/* NULL */

interface INullType extends IType {
  name: 'null';
}

function isNullType(
  value: IType,
): value is INullType {
  return (value.name === 'null');
}

function nullType(): INullType {
  return {
    name: 'null',
  };
}

function verifyNullType(
  value: unknown,
  variableName: string,
): void {
  if (value !== null) {
    throwExpectedTypeError(variableName, 'null');
  }
}

/* SYMBOL */

interface ISymbolType extends IType {
  name: 'symbol';
}

function isSymbolType(
  value: IType,
): value is ISymbolType {
  return (value.name === 'symbol');
}

function symbolType(): ISymbolType {
  return {
    name: 'symbol',
  };
}

function verifySymbolType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'symbol') {
    throwExpectedTypeError(variableName, 'symbol');
  }
}

/* STRING */

interface IStringType extends IType {
  name: 'string';
}

function isStringType(
  value: IType,
): value is IStringType {
  return (value.name === 'string');
}


function stringType(): IStringType {
  return {
    name: 'string',
  };
}

function verifyStringType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'string') {
    throwExpectedTypeError(variableName, 'string');
  }
}

/* NUMBER */

interface INumberType extends IType {
  name: 'number';
}

function isNumberType(
  value: IType,
): value is INumberType {
  return (value.name === 'number');
}

function numberType(): INumberType {
  return {
    name: 'number',
  };
}

function verifyNumberType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'number') {
    throwExpectedTypeError(variableName, 'number');
  }
}

/* BOOLEAN */

interface IBooleanType extends IType {
  name: 'boolean';
}

function isBooleanType(
  value: IType,
): value is IBooleanType {
  return (value.name === 'boolean');
}

function booleanType(): IBooleanType {
  return {
    name: 'boolean',
  };
}

function verifyBooleanType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'boolean') {
    throwExpectedTypeError(variableName, 'boolean');
  }
}

/* FUNCTION */

interface IFunctionType extends IType {
  name: 'function';
}

function isFunctionType(
  value: IType,
): value is IFunctionType {
  return (value.name === 'function');
}

function functionType(): IFunctionType {
  return {
    name: 'function',
  };
}

function verifyFunctionType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'function') {
    throwExpectedTypeError(variableName, 'function');
  }
}

/* ARRAY */

interface IArrayType extends IType {
  name: 'array';
  type: ITypeUnion;
}

function isArrayType(
  value: IType,
): value is IArrayType {
  return (value.name === 'array');
}

function arrayType(
  type: ITypeUnion,
): IArrayType {
  return {
    name: 'array',
    type,
  };
}

function verifyArrayTypeElements(
  value: unknown[],
  variableName: string,
  type: ITypeUnion,
): void {
  for (let i = 0, l = value.length; i < l; i++) {
    verifyType(value[i], `${ variableName }[${ i }]`, type);
  }
}

function verifyArrayType(
  value: unknown,
  variableName: string,
  type: IArrayType,
): void {
  if (!Array.isArray(value)) {
    throwExpectedTypeError(variableName, 'array');
  } else {
    verifyArrayTypeElements(value, variableName, type.type);
  }
}


/* INTERFACE */


type IInterfaceTypeProperty = [PropertyKey, ITypeUnion];

interface IInterfaceType extends IType {
  name: 'interface';
  properties: Iterable<IInterfaceTypeProperty>;
  extraPropertiesType?: ITypeUnion;
}

function isInterfaceType(
  value: IType,
): value is IInterfaceType {
  return (value.name === 'interface');
}


function interfaceType(
  properties: Iterable<IInterfaceTypeProperty>,
  extraPropertiesType?: ITypeUnion,
): IInterfaceType {
  return {
    name: 'interface',
    properties,
    extraPropertiesType,
  };
}

function interfaceTypeObject(
  properties: Record<PropertyKey, ITypeUnion>,
): IInterfaceType {
  return interfaceType(
    Object.entries(properties),
  );
}

function intersectInterfaces(
  interfaces: Iterable<IInterfaceType>,
): IInterfaceType {
  const map: Map<PropertyKey, ITypeUnion> = new Map<PropertyKey, ITypeUnion>();
  let extraPropertiesType: ITypeUnion | undefined;

  const interfacesIterator: Iterator<IInterfaceType> = interfaces[Symbol.iterator]();
  let interfacesResult: IteratorResult<IInterfaceType>;
  while (!(interfacesResult = interfacesIterator.next()).done) {
    const parent: IInterfaceType = interfacesResult.value;

    const interfacesPropertiesIterator: Iterator<IInterfaceTypeProperty> = parent.properties[Symbol.iterator]();
    let interfacesPropertiesResult: IteratorResult<IInterfaceTypeProperty>;
    while (!(interfacesPropertiesResult = interfacesPropertiesIterator.next()).done) {
      const [propertyKey, propertyType] = interfacesPropertiesResult.value;

      if (map.has(propertyKey)) {
        throw new Error(`Property ${ propertyKeyToPropertyName(propertyKey) } already defined`);
      } else {
        map.set(propertyKey, propertyType);
      }
    }

    if (parent.extraPropertiesType !== void 0) {
      if (extraPropertiesType === void 0) {
        extraPropertiesType = parent.extraPropertiesType;
      } else {
        throw new Error(`[index]: ${ extraPropertiesType.name } already defined`);
      }
    }
  }

  return interfaceType(map.entries(), extraPropertiesType);
}

function extendInterface(
  type: IInterfaceType,
  parents: Iterable<IInterfaceType>,
): IInterfaceType {
  return intersectInterfaces([type, ...parents]);
}

// TODO omit, pick, extract, exclude
// const a: Pick<5>;

function propertyKeyToPropertyName(
  propertyKey: PropertyKey,
): string {
  return (typeof propertyKey === 'symbol')
    ? propertyKey.toString()
    : JSON.stringify(propertyKey);
}

function verifyInterfaceTypeProperties(
  value: object,
  variableName: string,
  properties: Iterable<IInterfaceTypeProperty>,
): Set<PropertyKey> {
  const propertyKeys: Set<PropertyKey> = new Set<PropertyKey>();
  const iterator: Iterator<IInterfaceTypeProperty> = properties[Symbol.iterator]();
  let result: IteratorResult<IInterfaceTypeProperty>;
  while (!(result = iterator.next()).done) {
    const [propertyKey, propertyType] = result.value;
    verifyType(value[propertyKey], `${ variableName }[${ propertyKeyToPropertyName(propertyKey) }]`, propertyType);
    propertyKeys.add(propertyKey);
  }
  return propertyKeys;
}

function verifyInterfaceTypeExtraPropertiesType(
  value: object,
  variableName: string,
  propertyKeys: Set<PropertyKey>,
  extraPropertiesType?: ITypeUnion,
): void {
  if (extraPropertiesType !== void 0) {
    for (const propertyKey in value) {
      if (!propertyKeys.has(propertyKey)) {
        verifyType(value[propertyKey], `${ variableName }[${ propertyKeyToPropertyName(propertyKey) }]`, extraPropertiesType);
      }
    }
  }
}

function verifyInterfaceType(
  value: unknown,
  variableName: string,
  type: IInterfaceType,
): void {
  if ((typeof value !== 'object') || (value === null)) {
    throwExpectedTypeError(variableName, 'object');
  } else {
    const propertyKeys: Set<PropertyKey> = verifyInterfaceTypeProperties(value, variableName, type.properties);
    verifyInterfaceTypeExtraPropertiesType(value, variableName, propertyKeys, type.extraPropertiesType);
  }
}



/* INSTANCE OF */

type IConstructor = new (...args: any[]) => any;

interface IInstanceOfType extends IType {
  name: 'instance-of';
  constructor: IConstructor;
}

function isInstanceOfType(
  value: IType,
): value is IInstanceOfType {
  return (value.name === 'instance-of');
}

function instanceOfType(
  constructor: IConstructor,
): IInstanceOfType {
  return {
    name: 'instance-of',
    constructor,
  };
}

function verifyInstanceOfType(
  value: unknown,
  variableName: string,
  type: IInstanceOfType,
): void {
  if (!(value instanceof type.constructor)) {
    throwExpectedTypeError(variableName, `instance of ${ type.constructor.name }`);
  }
}


/* UNION */

interface IUnionType extends IType {
  name: 'union';
  types: Iterable<ITypeUnion>;
}

function isUnionType(
  value: IType,
): value is IUnionType {
  return (value.name === 'union');
}

function unionType(
  types: Iterable<ITypeUnion>,
): IUnionType {
  return {
    name: 'union',
    types,
  };
}

function verifyUnionType(
  value: unknown,
  variableName: string,
  type: IUnionType,
): void {
  const iterator: Iterator<ITypeUnion> = type.types[Symbol.iterator]();
  let result: IteratorResult<ITypeUnion>;
  while (!(result = iterator.next()).done) {
    try {
      verifyType(value, variableName, result.value);
      return;
    } catch {}
  }

  throwExpectedTypeError(
    variableName,
    Array.from(type.types, (type: ITypeUnion) => type.name)
      .join(' | '),
  );
}


function unionTypeReduced(
  types: Iterable<ITypeUnion>,
): IUnionType {
  return reduceUnionType(unionType(types));
}

function reduceUnionTypes(
  types: Iterable<ITypeUnion>,
  reducedTypes: ITypeUnion[] = [],
): ITypeUnion[] {
  const iterator: Iterator<ITypeUnion> = types[Symbol.iterator]();
  let result: IteratorResult<ITypeUnion>;
  while (!(result = iterator.next()).done) {
    if (isUnionType(result.value)) {
      reduceUnionTypes(types, reducedTypes);
    } else {
      reducedTypes.push(result.value);
    }
  }
  return reducedTypes;
}

function reduceUnionType(
  type: IUnionType,
): IUnionType {
  return unionType(reduceUnionTypes(type.types));
}

function optionalType(
  type: ITypeUnion,
): IUnionType {
  return unionType(isUnionType(type)
    ? [
      ...type.types,
      undefinedType(),
    ]
    : [
      type,
      undefinedType(),
    ]
  );
}


/*--*/

type IPrimitiveTypeUnion =
  IUndefinedType
  | INullType
  | ISymbolType
  | IStringType
  | INumberType
  | IBooleanType
  | IFunctionType
  ;

type ITypeUnion =
  IPrimitiveTypeUnion
  | IStaticType
  | IInterfaceType
  | IInstanceOfType
  | IArrayType
  | IUnionType
  ;


function verifyType(
  value: unknown,
  variableName: string,
  type: ITypeUnion,
): void {
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
    verifyArrayType(value, variableName, type);
  } else if (isInterfaceType(type)) {
    verifyInterfaceType(value, variableName, type);
  } else if (isInstanceOfType(type)) {
    verifyInstanceOfType(value, variableName, type);
  } else if (isUnionType(type)) {
    verifyUnionType(value, variableName, type);
  } else {
    throw new Error(`Unknown type: ${ (type as IType).name }`);
  }
}

/*-------------*/

/*-------------*/

interface IA {
  a: string;
  b: number | boolean;
  c: IA;
  d?: string;
  e: Uint8Array;
  f: number[];
  g: () => void,
  h: 5,
  i: { [key: string]: number };
  j: IC;
}

interface IB {
  typeB: boolean;
}

interface IC extends IB {
  typeC: string;
}

/*-------------*/

function typeDebug() {
  const typeB: IInterfaceType = interfaceTypeObject({
    typeB: booleanType(),
  });

  const typeC: IInterfaceType = extendInterface(interfaceTypeObject({
    typeC: stringType(),
  }),  [typeB]);

  const typeA: IInterfaceType = interfaceTypeObject({
    a: stringType(),
    b: unionType([
      numberType(),
      booleanType(),
    ]),
    d: optionalType(stringType()),
    e: instanceOfType(Uint8Array),
    f: arrayType(numberType()),
    g: functionType(),
    h: staticType(5),
    i: interfaceType([], numberType()),
    j: typeC,
  });

  const a = {
    a: 'abc',
    b: 1,
    e: new Uint8Array(5),
    f: [0],
    g: () => {},
    h: 5,
    i: { i1: 2 },
    j: {
      typeB: true,
      typeC: 'a',
    },
  };

  verifyType(a, 'a', typeA);
}


/*-------------*/

export function webRTCDebug() {
  console.log('ok');
  typeDebug();
}

