import { getDocument } from '@lifaon/rx-dom';

export function getBaseURI(): string {
  return getDocument().baseURI;
  // const base: HTMLBaseElement | null = document.querySelector('base');
  // return (base === null)
  //   ? getLocation().origin
  //   : base.href;
}

