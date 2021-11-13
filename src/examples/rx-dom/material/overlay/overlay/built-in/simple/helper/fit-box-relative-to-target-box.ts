import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
import { ISize } from '../../../../../../../misc/types/size/size.type';
import { mathClamp } from '../../../../../../../misc/math/clamp';


/*
  |--------------------------------------------|
  |               externalBox                  |
  |                                            |
  |                   |---------------|        |
  |                   |   targetBox   |        |
  |                   |---------------|        |
  |                   |------------------|     |
  |                   |   expectedBox    |     |
  |                   |                  |     |
  |                   |                  |     |
  |                   |------------------|     |
  |--------------------------------------------|
 */


export function fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference(
  externalBox: IPositionAndSize,
  targetBox: IPositionAndSize,
  expectedBox: ISize,
): IPositionAndSize {
  const width: number = Math.min(expectedBox.width, externalBox.width);
  const left: number = mathClamp(targetBox.left, externalBox.left, externalBox.width - width + externalBox.left);

  const availableHeightOnTop: number = Math.max(targetBox.top - externalBox.top, 0);
  const availableHeightOnBottom: number = Math.max(externalBox.top + externalBox.height - targetBox.top - targetBox.height, 0);

  let height: number, top: number;

  const bottom: boolean = (availableHeightOnBottom >= expectedBox.height) // enough space on bottom
    || (
      (availableHeightOnTop < expectedBox.height) // not enough space on top
      && (availableHeightOnBottom >= availableHeightOnTop)
    );

  if (bottom) {
    height = Math.min(expectedBox.height, availableHeightOnBottom);
    top = mathClamp(targetBox.top + targetBox.height, externalBox.top, externalBox.top + externalBox.height);
  } else {
    height = Math.min(expectedBox.height, availableHeightOnTop);
    top = targetBox.top - height;
  }

  return {
    left,
    top,
    width,
    height,
  };
}
