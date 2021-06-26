import { Path } from './path.class';
import { isPath } from './is-path';

export type IPathLike = Path | string;

export function toPath(
  value: IPathLike,
): Path {
  return isPath(value)
    ? value
    : new Path(value);
}


