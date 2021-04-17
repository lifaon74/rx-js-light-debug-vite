import { Path } from '../path/path.class';
import { convertRoutePathToRegExpPattern } from './convert-route-path-to-reg-exp-pattern';

/**
 * Syntax:
 * /path_segment
 * /:id
 * /**
 * /*
 */
export function convertRoutePathToRegExp(
  path: Path,
): RegExp {
  return new RegExp(convertRoutePathToRegExpPattern(path));
}
