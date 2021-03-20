import { composeEmitFunction, composeEmitPipeFunctions, mapEmitPipe } from '@lifaon/rx-js-light';


function composeExample1() {
  const emitPipe = composeEmitPipeFunctions([
    mapEmitPipe<number, number>((value: number) => (value + 2)),
    mapEmitPipe<number, string>((value: number) => value.toString(10)),
  ]);

  const emit = emitPipe((value: string) => {
    console.log('value', value);
  });

  emit(5);
}

function composeExample2() {
  const emit = composeEmitFunction([
    mapEmitPipe<number, number>((value: number) => (value + 2)),
    mapEmitPipe<number, string>((value: number) => value.toString(10)),
  ], (value: string) => {
    console.log('value', value);
  });

  emit(5);
}

/*--------------------*/


export function composeExample() {
  composeExample1();
  composeExample2();
}

