import {
  createMulticastReplayLastSource, IMulticastReplayLastSource, ISubscribeFunction, ISubscribePipeFunction,
  mapSubscribePipe,
  pipeSubscribeFunction
} from '@lifaon/rx-js-light';


// class FormControl {
//
// }


export type IFormInputValidator<GType> = ISubscribePipeFunction<IFormInputValue<GType>, IFormInputValue<GType>>;

export type IFormInputValue<GType> = GType | null;

abstract class FormInput<GType> {
  readonly value: IMulticastReplayLastSource<IFormInputValue<GType>>;
  readonly isPristine: ISubscribeFunction<boolean>;

  protected constructor() {
    this.value = createMulticastReplayLastSource<IFormInputValue<GType>>({ initialValue: null });
    this.isPristine = pipeSubscribeFunction(this.value.subscribe, [
      mapSubscribePipe((value: IFormInputValue<GType>) => (value === null)),
    ]);
  }
}

// abstract class FormInput<GType> {
//   readonly value: GType | null;
//   readonly isPristine: ISubscribeFunction<boolean>;
//
//
//   protected constructor() {
//     this.value = null;
//   }
//
//   // isPristine(): boolean {
//   //   return this.value === null;
//   // }
//
//
// }

// class FormStringInput {
//   protected _rawValue: string;
//
//   constructor() {
//     this._rawValue = '';
//   }
//
//   get rawValue(): string {
//
//   }
// }



export function formControlDebug() {
  const input: HTMLInputElement = document.createElement('input');

}

