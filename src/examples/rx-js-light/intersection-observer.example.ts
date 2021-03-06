import { fromIntersectionObserver, fromMatchMedia, mapSubscribePipe, pipeSubscribeFunction } from '@lifaon/rx-js-light';



export function intersectionObserverExample() {
  const element = document.createElement('div');
  element.style.height = '400px';
  element.style.backgroundColor = 'red';
  element.style.marginTop = '150%';
  document.body.appendChild(element);

  const subscribe = pipeSubscribeFunction(fromIntersectionObserver(element, { threshold: [0, 1] }), [
    mapSubscribePipe((entry: IntersectionObserverEntry): string => {
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
