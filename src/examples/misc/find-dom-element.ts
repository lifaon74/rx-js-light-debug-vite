import {
  distinctObservablePipe, idle, interval, IObservable, mapObservablePipe, pipeObservable,
} from '@lirx/core';
import { getDocument, querySelector, querySelectorAll } from '@lirx/dom';

export interface IFindDOMElementOptions {
  timeout?: number;
  // parentElement?: ParentNode;
}

export function findDOMElement<Element extends HTMLElement>(
  selector: string,
  parentElement: ParentNode = getDocument(),
  {
    timeout = 50,
  }: IFindDOMElementOptions = {},
): IObservable<Element | null> {
  return pipeObservable(idle({ timeout }), [
    mapObservablePipe<any, Element | null>((): Element | null => {
      return querySelector<Element>(parentElement, selector);
    }),
    distinctObservablePipe<Element | null>(),
  ]);
}

export function findDOMElements<Elements extends ArrayLike<HTMLElement>>(
  selector: string,
  parentElement: ParentNode = getDocument(),
  {
    timeout = 50,
  }: IFindDOMElementOptions = {},
): IObservable<Elements> {
  return pipeObservable(idle({ timeout }), [
    mapObservablePipe<any, Elements>((): Elements => {
      return querySelectorAll<Element>(parentElement, selector) as unknown as Elements;
    }),
  ]);
}


// export function findDOMElements<Elements extends HTMLElement[]>(
//   selector: string,
//   {
//     timeout = 5000,
//     interval = 50,
//     parentElement = document,
//     single = false,
//     signal,
//   }: IFindDOMElementOptions = {},
// ): Promise<Elements> {
//   return raceAbortedOptional(
//     new Promise<Elements>((resolve: (value: Elements) => void, reject: (reason: Error) => void) => {
//       const endTime = Date.now() + timeout;
//       const loop = () => {
//         if (!isSignalAbortedOptional(signal)) {
//           if (Date.now() > endTime) {
//             reject(new Error('Timeout'));
//           } else {
//             if (single) {
//               const element: Element | null = parentElement.querySelector(selector);
//               if (element === null) {
//                 setTimeout(loop, interval);
//               } else {
//                 resolve([element] as Elements);
//               }
//             } else {
//               const elements: NodeListOf<Element> = parentElement.querySelectorAll(selector);
//               if (elements.length === 0) {
//                 setTimeout(loop, interval);
//               } else {
//                 resolve(Array.from(elements) as Elements);
//               }
//             }
//           }
//         }
//       };
//       loop();
//     }),
//     signal,
//   );
// }



