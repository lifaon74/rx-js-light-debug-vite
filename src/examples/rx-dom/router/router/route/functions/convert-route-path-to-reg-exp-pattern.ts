
function wrapPathSegment(
  pattern: string,
): string {
  return `(^|\\/)${ pattern }($|\\/)`;
}

export function convertRoutePathToRegExpPattern(
  path: string,
): string {
  return '^' + path
    .replace(
      new RegExp(wrapPathSegment(':([\\w\\-]+)'), 'g'),
      (match: string, start: string, id: string, end: string) => {
        return `${ start }(?<${ id }>[\\w\\-]+)${ end }`;
      },
    )
    .replace(
      new RegExp(wrapPathSegment('\\*'), 'g'),
      (match: string, start: string, end: string) => {
        return `${ start }[\\w\\-]+${ end }`;
      },
    )
    .replace(
      new RegExp(wrapPathSegment('\\*\\*'), 'g'),
      (match: string, start: string, end: string) => {
        return `${ start }[\\w\\-\\/]*${ end }`;
      },
    )
    ;
}
