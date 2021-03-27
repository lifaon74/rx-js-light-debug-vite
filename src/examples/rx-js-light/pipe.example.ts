import { mapSubscribePipe, of, pipeSubscribePipeFunctions } from '@lifaon/rx-js-light';


function pipeExample1() {
  const subscribePipe = pipeSubscribePipeFunctions([
    mapSubscribePipe<number, number>((value: number) => (value + 2)),
    mapSubscribePipe<number, string>((value: number) => value.toString(10)),
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

