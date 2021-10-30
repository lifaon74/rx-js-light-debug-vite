
// https://wicg.github.io/eyedropper-api/

export interface IColorSelectionResult {
  sRGBHex: string;
}

export interface IColorSelectionOptions {
  signal: AbortSignal;
}



export interface IEyeDropperConstructor {
  new(): IEyeDropper;
}


export interface IEyeDropper {
  open(options?: IColorSelectionOptions): Promise<IColorSelectionResult>
}


export function isEyeDropperAvailable(): boolean {
  return ('EyeDropper' in globalThis);
}

export function getEyeDropperConstructor(): IEyeDropperConstructor {
  if(isEyeDropperAvailable()) {
    return (globalThis as any).EyeDropper as IEyeDropperConstructor;
  } else {
    throw new Error(`Missing EyeDropper`);
  }
}

