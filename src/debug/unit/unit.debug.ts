import { INumberToExponentOptions, numberToExponent } from './number-to-exponent';


/*--------------------*/

// https://en.wikipedia.org/wiki/SI_derived_unit


/*--------------------*/

// shape: value * (unitA**exponent) * (unitB**exponent) * ...

export type IUnitWithExponentTuple = [
  unit: string,
  exponent: number,
];

export type IUnitsMapLike = Iterable<IUnitWithExponentTuple>;
export type IUnitsMap = Map<string, number>; // unit, exponent
export type IReadonlyUnitsMap = ReadonlyMap<string, number>;

export function createUnitsMap(
  units?: IUnitsMapLike,
): IUnitsMap {
  return new Map<string, number>(units as IUnitsMapLike);
}

export function unitsMapLikeToUnitsMap(
  units: IUnitsMapLike,
): IUnitsMap {
  return (units instanceof Map)
    ? units
    : createUnitsMap(units as IUnitsMapLike);
}


export function unitsMapToKey(
  units: IReadonlyUnitsMap,
): string {
  return Array.from(units.entries())
    .sort(([unitA]: IUnitWithExponentTuple, [unitB]: IUnitWithExponentTuple): number => {
      if (unitA === unitB) {
        return 0;
      } else if (unitA < unitB) {
        return -1;
      } else {
        return 1;
      }
    })
    .map(([unit, exponent]: IUnitWithExponentTuple): string => {
      return `${unit}^${exponent}`;
    })
    .join('*');
}

export function unitsMapLikeToKey(
  units: IUnitsMapLike,
): string {
  return unitsMapToKey(unitsMapLikeToUnitsMap(units));
}


export interface IUnit {
  readonly value: number;
  readonly units: IReadonlyUnitsMap;
}

export function createUnit(
  value: number,
  units: IUnitsMapLike,
): IUnit {
  return {
    value,
    units: unitsMapLikeToUnitsMap(units),
  };
}


/*--------------------*/

export function unitsEquals(
  {
    value: valueA,
    units: unitsA,
  }: IUnit,
  {
    value: valueB,
    units: unitsB,
  }: IUnit,
): boolean {
  if (
    (valueA === valueB)
    && (unitsA.size === unitsB.size)
  ) {
    const iteratorB: Iterator<IUnitWithExponentTuple> = unitsB.entries();
    let resultB: IteratorResult<IUnitWithExponentTuple>;
    while (!(resultB = iteratorB.next()).done) {
      const [unit, exponentB]: IUnitWithExponentTuple = resultB.value;
      if (unitsA.has(unit)) {
        const exponentA: number = unitsA.get(unit) as number;
        if (exponentA !== exponentB) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}


/*--------------------*/

export function multiplyUnits(
  {
    value: valueA,
    units: unitsA,
  }: IUnit,
  {
    value: valueB,
    units: unitsB,
  }: IUnit,
): IUnit {
  const value: number = valueA * valueB;
  const units: IUnitsMap = createUnitsMap(unitsA);

  const iteratorB: Iterator<IUnitWithExponentTuple> = unitsB.entries();
  let resultB: IteratorResult<IUnitWithExponentTuple>;
  while (!(resultB = iteratorB.next()).done) {
    const [unit, exponentB]: IUnitWithExponentTuple = resultB.value;

    if (units.has(unit)) {
      const exponentA: number = units.get(unit) as number;
      const exponent: number = exponentA + exponentB;
      if (exponent === 0) {
        units.delete(unit);
      } else {
        units.set(unit, exponent);
      }
    } else {
      units.set(unit, exponentB);
    }
  }

  return {
    value,
    units,
  };
}


export function invertUnit(
  {
    value,
    units,
  }: IUnit,
): IUnit {
  const _value: number = 1 / value;
  const _units: IUnitsMap = createUnitsMap(
    Array.from(units, ([unit, exponent]: IUnitWithExponentTuple): IUnitWithExponentTuple => {
      return [
        unit,
        -exponent,
      ];
    }),
  );

  return {
    value: _value,
    units: _units,
  };
}

export function divideUnits(
  unitA: IUnit,
  unitB: IUnit,
): IUnit {
  return multiplyUnits(
    unitA,
    invertUnit(unitB),
  );
}

/*--------------------*/

// export function newtonToSI(
//   value: number,
// ): IUnit {
//   return createUnit(value, [['kg', 1], ['m', 1], ['s', -2]]);
// }
//
// export function kilometerToMeter(
//   value: number,
// ): IUnit {
//   return createUnit(value * 1000, [['m', 1]]);
// }

export interface IUnitConverter {
  (value: number): number;
}

// export type IUnitConverters = Map<IUnitsMap, Map<IUnitsMap, IUnitConverter>>;
export type IUnitConverters = Map<string, Map<string, IUnitConverter>>;

// export const UNIT_CONVERTERS: IUnitConverters = new Map<IUnitsMap, Map<IUnitsMap, IUnitConverter>>();
export const UNIT_CONVERTERS: IUnitConverters = new Map<string, Map<string, IUnitConverter>>();

export const PASS_THROUGH_CONVERTER = (value: number) => value;

function _setUnitConverter(
  from: string,
  to: string,
  converter: IUnitConverter,
  converters: IUnitConverters = UNIT_CONVERTERS,
): void {
  if (converters.has(from)) {
    const toToConverterMap: Map<string, IUnitConverter> = converters.get(from) as Map<string, IUnitConverter>;
    if (toToConverterMap.has(to)) {
      throw new Error(`A converter already exists for: '${from}' -> '${to}'`);
    } else {
      toToConverterMap.set(to, converter);
    }
  } else {
    converters.set(from, new Map<string, IUnitConverter>([[to, converter]]));
  }
}


export function setUnitConverter(
  from: IUnitsMapLike,
  to: IUnitsMapLike,
  converter: IUnitConverter,
  converters?: IUnitConverters,
): void {
  _setUnitConverter(
    unitsMapLikeToKey(from),
    unitsMapLikeToKey(to),
    converter,
    converters,
  );
}

function _getUnitConverter(
  from: string,
  to: string,
  converters: IUnitConverters = UNIT_CONVERTERS,
): IUnitConverter | undefined {
  if (from === to) {
    return PASS_THROUGH_CONVERTER;
  } else if (converters.has(from)) {
    return (converters.get(from) as Map<string, IUnitConverter>).get(to);
  } else {
    return void 0;
  }
}


export interface IUnitConverterAndPath {
  units: string[];
  converter: IUnitConverter;
}

function _inferUnitConverters(
  from: string,
  to: string,
  maxIntermediateSteps: number = 5,
  converters: IUnitConverters = UNIT_CONVERTERS,
  memory: Set<string> = new Set<string>(),
): IUnitConverterAndPath[] {
  if (maxIntermediateSteps >= 0) {
    const key: string = `${JSON.stringify(from)}-${JSON.stringify(to)}`;
    if (memory.has(key)) {
      return [];
    } else {
      memory.add(key);
    }
    if (from === to) {
      return [{
        units: [from, to],
        converter: PASS_THROUGH_CONVERTER,
      }];
    } else if (converters.has(from)) {
      const toMap: Map<string, IUnitConverter> = converters.get(from) as Map<string, IUnitConverter>;
      if (toMap.has(to)) {
        return [{
          units: [from, to],
          converter: toMap.get(to) as IUnitConverter,
        }];
      } else {
        const list: IUnitConverterAndPath[] = [];
        const iterator: Iterator<[string, IUnitConverter]> = toMap.entries();
        let result: IteratorResult<[string, IUnitConverter]>;
        while (!(result = iterator.next()).done) {
          const [intermediateUnit, fromUnitToIntermediateUnitConverter]: [string, IUnitConverter] = result.value;
          list.push(
            ..._inferUnitConverters(
              intermediateUnit,
              to,
              maxIntermediateSteps - 1,
              converters,
              memory,
            )
              .map((intermediateUnitToToUnitConverter: IUnitConverterAndPath) => {
                const _intermediateUnitToToUnitConverter: IUnitConverter = intermediateUnitToToUnitConverter.converter;
                const converter: IUnitConverter = (input: number): number => {
                  return _intermediateUnitToToUnitConverter(fromUnitToIntermediateUnitConverter(input));
                };
                return {
                  units: [from, ...intermediateUnitToToUnitConverter.units],
                  converter: converter,
                } as IUnitConverterAndPath;
              }),
          );
        }
        if (list.length > 0) {
          list.sort((a: IUnitConverterAndPath, b: IUnitConverterAndPath) => {
            return a.units.length - b.units.length;
          });

          _setUnitConverter(from, to, list[0].converter, converters);
        }

        return list;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
}

function _inferUnitConverterOrThrow(
  from: string,
  to: string,
  maxIntermediateSteps?: number,
  converters?: IUnitConverters,
): IUnitConverter {
  const converter: IUnitConverter | undefined = _getUnitConverter(from, to);
  if (converter === void 0) {
    const _converters: IUnitConverterAndPath[] = _inferUnitConverters(from, to, maxIntermediateSteps, converters);
    if (_converters.length === 0) {
      throw new Error(`No converter found from '${from}' to '${to}'`);
    } else {
      return _converters[0].converter;
    }
  } else {
    return converter;
  }
}

export function inferUnitConverterOrThrow(
  from: IUnitsMapLike,
  to: IUnitsMapLike,
  maxIntermediateSteps?: number,
  converters?: IUnitConverters,
): IUnitConverter {
  return _inferUnitConverterOrThrow(
    unitsMapLikeToKey(from),
    unitsMapLikeToKey(to),
    maxIntermediateSteps,
    converters,
  );
}

// export function convertUnit(
//   unit: IUnit,
//   from: string,
//   to: string,
// ): IUnit {
//
// }

/*--------------------*/

export type IUnitsMultiplyNotation =
  | 'multiply'
  | 'divide'
  | 'divide-if-only-one'
  ;

export interface IUnitToStringOptions extends INumberToExponentOptions {
  valueToUnitsMultiplySign?: string; // (default: '')
  unitsMultiplySign?: string; // (default: '⋅')
  unitsDivideSign?: string; // (default: '/')
  unitsMultiplyNotation?: IUnitsMultiplyNotation; // (default: 'divide-if-only-one')
  hideExponentOne?: boolean; // (default: 'true')
}

export function unitToString(
  {
    value,
    units,
  }: IUnit,
  {
    valueToUnitsMultiplySign = '',
    unitsMultiplySign = '⋅',
    unitsDivideSign = '/',
    unitsMultiplyNotation = 'divide-if-only-one',
    hideExponentOne = true,
    ...options
  }: IUnitToStringOptions = {},
): string {

  const nullUnits: IUnitWithExponentTuple[] = [];
  const positiveUnits: IUnitWithExponentTuple[] = [];
  const negativeUnits: IUnitWithExponentTuple[] = [];

  const iterator: Iterator<IUnitWithExponentTuple> = units.entries();
  let result: IteratorResult<IUnitWithExponentTuple>;
  while (!(result = iterator.next()).done) {
    const unit: IUnitWithExponentTuple = result.value;
    const exponent: number = unit[1];
    if (exponent === 0) {
      nullUnits.push(unit);
    } else if (exponent > 0) {
      positiveUnits.push(unit);
    } else {
      negativeUnits.push(unit);
    }
  }

  if (unitsMultiplyNotation === 'divide-if-only-one') {
    unitsMultiplyNotation = (negativeUnits.length > 1)
      ? 'multiply'
      : 'divide';
  }

  if (
    (negativeUnits.length === 0)
    || (
      (unitsMultiplyNotation === 'divide')
      && (positiveUnits.length === 0)
    )
  ) {
    unitsMultiplyNotation = 'multiply';
  }

  const unitsToString = (
    units: IUnitWithExponentTuple[],
    exponentMultiplier: number,
  ): string => {
    return units.map(([unit, exponent]: IUnitWithExponentTuple): string => {
      const _exponent: number = exponent * exponentMultiplier;
      const exponentString: string = ((_exponent === 1) && hideExponentOne)
        ? ''
        : numberToExponent(_exponent, options);
      return `${unit}${exponentString}`;
    }).join(unitsMultiplySign);
  };

  let unitsString: string;

  const positiveUnitsString: string = unitsToString(positiveUnits, 1);

  if (unitsMultiplyNotation === 'multiply') {
    const negativeUnitsString: string = unitsToString(negativeUnits, 1);

    const separator: string = (
      (positiveUnitsString !== '')
      && (negativeUnitsString !== '')
    )
      ? unitsMultiplySign
      : '';

    unitsString = `${positiveUnitsString}${separator}${negativeUnitsString}`;
  } else {
    const negativeUnitsString: string = unitsToString(negativeUnits, -1);

    const separator: string = (
      (positiveUnitsString !== '')
      && (negativeUnitsString !== '')
    )
      ? unitsDivideSign
      : '';

    unitsString = `${positiveUnitsString}${separator}${negativeUnitsString}`;
  }

  if (unitsString !== '') {
    unitsString = `${valueToUnitsMultiplySign}${unitsString}`;
  }

  return `${value}${unitsString}`;
}

/*--------------------*/

export async function debugUnits() {
  // const unit = createUnit(5, [['km', 1], ['h', -1]]);
  // const unit = createUnit(5, [['km', 1], ['h', -1], ['s', -1]]);
  // const unit = createUnit(5, [['km', 1]]);

  // const unit = multiplyNumbersWithUnits(
  //   createUnit(5, [['km', 1]]),
  //   createUnit(3, [['h', -1]]),
  // );

  // const unit = multiplyUnits(
  //   createUnit(3, [['m', 1]]),
  //   createUnit(4, [['m', 1]]),
  // );

  // const unit = divideUnits(
  //   createUnit(3, [['m', 2]]),
  //   createUnit(2, [['m', 1]]),
  // );

  setUnitConverter([['kg', 1]], [['g', 1]], _ => _ * 1000);

  console.log(inferUnitConverterOrThrow([['kg', 1]], [['g', 1]])(5));

  // const unitA = createUnit(1, [['kg', 1]]);
  // const unitB = createUnit(1, [['g', 1]]);

  // const unitA = createUnit(1, [['N', 1]]);
  // const unitB = createUnit(1, [['kg', 1], ['m', 1], ['s', -2]]);

  // console.log(unitToString(unitB));
}

