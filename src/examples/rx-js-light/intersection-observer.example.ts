import { fromIntersectionObserver, fromMatchMedia, mapObservablePipe, pipeObservable } from '@lirx/core';



export function intersectionObserverExample() {
  const element = document.createElement('div');
  element.style.height = '400px';
  element.style.backgroundColor = 'red';
  element.style.marginTop = '150%';
  document.body.appendChild(element);

  const subscribe = pipeObservable(fromIntersectionObserver(element, { threshold: [0, 1] }), [
    mapObservablePipe((entry: IntersectionObserverEntry): string => {
      if (entry.intersectionRatio <= 0) {
        return 'red';
      } else if (entry.intersectionRatio >= 1) {
        return 'blue';
      } else {
        return 'green';
      }
    }),
  ]);

  subscribe((color: string) => {
    element.style.backgroundColor = color;
  });

}
