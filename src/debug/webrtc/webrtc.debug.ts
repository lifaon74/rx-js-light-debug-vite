import { staticType } from './type-checker/static/create-static-type';
import { stringType } from './type-checker/string/create-string-type';
import { numberType } from './type-checker/number/create-number-type';
import { booleanType } from './type-checker/boolean/create-boolean-type';
import { functionType } from './type-checker/function/create-function-type';
import { arrayType } from './type-checker/array/create-array-type';
import { IInterfaceType } from './type-checker/interface/interface-type.type';
import { interfaceType } from './type-checker/interface/create/create-interface-type';
import { extendInterface } from './type-checker/interface/create/extend-interface-type';
import { interfaceTypeObject } from './type-checker/interface/create/create-interface-type-from-object';
import { instanceOfType } from './type-checker/instance-of/create-instance-of';
import { unionType } from './type-checker/union/create-union-type';
import { optionalType } from './type-checker/optional/create-optional-type';
import { verifyType } from './type-checker/any/verify-any-type';


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
  }), [typeB]);

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

  typeA.properties = [
    ...typeA.properties,
    ['c', typeA],
  ];

  const a: IA = {
    a: 'abc',
    b: 1,
    c: (void 0 as unknown) as IA,
    e: new Uint8Array(5),
    f: [0],
    g: () => {
    },
    h: 5,
    i: { i1: 2 },
    j: {
      typeB: true,
      typeC: 'a',
    },
  };

  a.c = a;

  verifyType(a, 'a', typeA);
}


/*-------------*/

export function webRTCDebug() {
  console.log('ok');
  typeDebug();
}

