import { IArrayBufferView } from '../array-buffer-view.type';

export type IBufferConstructor<GBuffer extends IArrayBufferView> = new (size: number, ...args: any[]) => GBuffer


export class CircularBuffer<GBuffer extends IArrayBufferView> {
  protected _readIndex: number; // [0, size]
  protected _writeIndex: number;
  protected readonly _buffer: GBuffer;
  protected readonly _bufferLengthPlusOne: number; // computed

  constructor(
    buffer: GBuffer,
  ) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._buffer = buffer;
    this._bufferLengthPlusOne = this._buffer.length + 1;
  }

  get readIndex(): number {
    return this._readIndex;
  }

  get writeIndex(): number {
    return this._writeIndex;
  }

  readable(): number {
    return (this._writeIndex >= this._readIndex)
      ? (this._writeIndex - this._readIndex)
      : (this._bufferLengthPlusOne - this._readIndex + this._writeIndex);
  }

  writable(): number {
    return (this._buffer.length - this.readable());
  }

  write(
    buffer: GBuffer,
  ): void {
    if (buffer.length <= this.writable()) {
      const writeToDataLengthBytes: number = this._buffer.length - this._writeIndex;
      if (writeToDataLengthBytes >= buffer.length) {
        this._buffer.set(buffer, this._writeIndex);
      } else if (writeToDataLengthBytes === 0) {
        this._buffer.set(buffer);
      } else {
        this._buffer.set(buffer.subarray(0, writeToDataLengthBytes), this._writeIndex);
        this._buffer.set(buffer.subarray(writeToDataLengthBytes));
      }
      this._writeIndex = (this._writeIndex + buffer.length) % this._bufferLengthPlusOne;
    } else {
      throw new Error(`Not enough writable bytes`);
    }
  }

  read(
    length: number,
    increment: boolean,
  ): Readonly<GBuffer> {
    this._ensureReadable(length);
    return this._read(length, increment);
  }

  incrementReadIndex(
    length: number,
  ): void {
    this._ensureReadable(length);
    this._incrementReadIndex(length);
  }

  readAll(
    increment: boolean,
  ): Readonly<GBuffer> {
    return this._read(this.readable(), increment);
  }

  protected _ensureReadable(
    length: number,
  ): void {
    if (length > this.readable()) {
      throw new Error(`Not enough readable bytes`);
    }
  }

  protected _read(
    length: number,
    increment: boolean,
  ): Readonly<GBuffer> {
    const readToDataLengthBytes: number = this._buffer.length - this._readIndex;
    let buffer: GBuffer;

    if (readToDataLengthBytes >= length) {
      buffer = this._buffer.subarray(this._readIndex, this._readIndex + length) as GBuffer;
    } else if (readToDataLengthBytes === 0) {
      buffer = this._buffer.subarray(0, length) as GBuffer;
    } else {
      buffer = new (this._buffer.constructor as IBufferConstructor<GBuffer>)(length);
      buffer.set(this._buffer.subarray(this._readIndex));
      buffer.set(this._buffer.subarray(0, length - readToDataLengthBytes), readToDataLengthBytes);
    }

    if (increment) {
      this._incrementReadIndex(length);
    }

    return buffer;
  }

  protected _incrementReadIndex(
    length: number,
  ): void {
    this._readIndex = (this._readIndex + length) % this._bufferLengthPlusOne;
  }
}



/*------------*/

export type ICircularUint8Array = CircularBuffer<Uint8Array>;

export function createCircularUint8Array(
  size: number = 0x100000, // 1MB
): ICircularUint8Array {
  return new CircularBuffer<Uint8Array>(new Uint8Array(size));
}
