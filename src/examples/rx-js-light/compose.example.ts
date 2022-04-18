import { composeObserver, composeObserverPipes, mapObserverPipe } from '@lirx/core';


function composeExample1() {
  const emitPipe = composeObserverPipes([
    mapObserverPipe<number, number>((value: number) => (value + 2)),
    mapObserverPipe<number, string>((value: number) => value.toString(10)),
  ]);

  const emit = emitPipe((value: string) => {
    console.log('value', value);
  });

  emit(5);
}

function composeExample2() {
  const emit = composeObserver([
    mapObserverPipe<number, number>((value: number) => (value + 2)),
    mapObserverPipe<number, string>((value: number) => value.toString(10)),
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

