import { ISize } from '../../../../../../misc/types/size/size.type';

export function getWindowSize(): ISize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
