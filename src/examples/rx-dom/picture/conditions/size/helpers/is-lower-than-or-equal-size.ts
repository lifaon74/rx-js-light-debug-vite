import { ISize } from '../../../../../misc/types/size/size.type';

export function _isLowerThanOrEqualSize(
  sizeA: ISize,
): (sizeB: ISize) => boolean {
  return (sizeB: ISize): boolean => (
    (sizeB.width <= sizeA.width)
    && (sizeB.height <= sizeA.height)
  );
}
