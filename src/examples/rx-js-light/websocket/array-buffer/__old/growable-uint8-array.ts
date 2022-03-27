import { u8 } from '../number-types/dist';


// export interface IGrowableUint8Array {
//   length: number;
//   data: Uint8Array;
// }
//
// export function createGrowableUint8Array(
//   initialSize: number = 0xff,
// ): IGrowableUint8Array {
//   return {
//     length: 0,
//     data: new Uint8Array(initialSize),
//   };
// }
//
//
// export function getGrowableUint8ArrayData(
//   growableUint8Array: IGrowableUint8Array,
// ): Uint8Array {
//   return growableUint8Array.data.subarray(0, growableUint8Array.length);
// }
//
// export function getGrowableUint8ArrayDataClone(
//   growableUint8Array: IGrowableUint8Array,
// ): Uint8Array {
//   return growableUint8Array.data.slice(0, growableUint8Array.length);
// }
//
// export function pushValueInGrowableUint8Array(
//   value: u8,
//   growableUint8Array: IGrowableUint8Array,
// ): void {
//   if (growableUint8Array.data.length <= growableUint8Array.length) {
//     const newBuffer: Uint8Array = new Uint8Array(growableUint8Array.data.length * 2);
//     newBuffer.set(growableUint8Array.data);
//     growableUint8Array.data = newBuffer;
//   }
//   growableUint8Array.data[growableUint8Array.length] = value;
//   growableUint8Array.length++;
// }


export class GrowableUint8Array {
  protected _length: number;
  protected _data: Uint8Array;

  constructor() {
    this._length = 0;
    this._data = new Uint8Array();
  }

  get length(): number {
    return this._length;
  }

  get data(): Uint8Array {
    return this._data.subarray(0, this._length);
  }

  get dataClone(): Uint8Array {
    return this._data.slice(0, this._length);
  }

  push(
    data: Readonly<Uint8Array>,
  ): void {
    if (this._data.length === 0) {
      this._data = data;
      this._length = data.length;
    } else {
      const newLength: number = this._length + data.length;
      if (this._data.length < newLength) {
        const _data: Uint8Array = new Uint8Array(newLength * 2);
        _data.set(this._data);
        this._data = _data;
      }
      this._data.set(data, this._length);
      this._length = newLength;
    }
  }
}
