import { ISize } from './size.type';

export function getWindowSize(): ISize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
