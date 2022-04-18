import { mapObservablePipe, of, pipeObservablePipes } from '@lirx/core';


function pipeExample1() {
  const subscribePipe = pipeObservablePipes([
    mapObservablePipe<number, number>((value: number) => (value + 2)),
    mapObservablePipe<number, string>((value: number) => value.toString(10)),
  ]);

  const subscribe = subscribePipe(of(5));

  subscribe((value: string) => {
    console.log('value', value);
  });
}

/*--------------------*/


export function pipeExample() {
  pipeExample1();
}

