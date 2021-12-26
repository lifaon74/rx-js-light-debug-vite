import { convertRoutePathToRegExpPattern } from './convert-route-path-to-reg-exp-pattern';

/**
 * Syntax:
 * /path_segment
 * /:id
 * /**
 * /*
 */
export function convertRoutePathToRegExp(
  path: string,
): RegExp {
  return new RegExp(convertRoutePathToRegExpPattern(path));
}
