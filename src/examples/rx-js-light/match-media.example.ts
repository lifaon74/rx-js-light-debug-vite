import { fromMatchMedia } from '@lifaon/rx-js-light';


export function matchMediaExample() {
  const subscribe = fromMatchMedia('(max-width: 600px)');

  subscribe((matches: boolean) => {
    document.body.style.backgroundColor = matches
      ? 'red'
      : 'green';
  });
}
