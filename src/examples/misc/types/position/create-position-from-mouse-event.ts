import { IPosition } from './position.type';
import { createPosition } from './create-position';

export function createPositionFromMouseEvent(
  event: MouseEvent,
): IPosition {
  return createPosition(
    event.clientX,
    event.clientY,
  );
}
