import { ICanActivateFunctionReturn, IRouteParams, IRXRoute, IRXRoutesList, normalizeRoutePath } from '@lirx/router';
import { singleN } from '@lirx/core';

export type IRXRouteSlug = [
  target: string,
  slugs: readonly string[],
];

export function createSlugs(
  slugs: IRXRouteSlug[],
  prefix: string = '',
): IRXRoutesList {
  return slugs
    .flatMap(([target, slugs]: IRXRouteSlug): IRXRoute[] => {
      const _target: string = normalizeRoutePath(target);
      return slugs.map((slug: string): IRXRoute => {
        return {
          path: `${prefix}${slug}`,
          canActivate: (params: IRouteParams): ICanActivateFunctionReturn => {
            const url: string = _target.replace(
              new RegExp('(^|\\/):([\\w\\-]+)($|\\/)', 'g'),
              (match: string, start: string, id: string, end: string) => {
                if (id in params) {
                  return `${start}${params[id]}${end}`;
                } else {
                  throw new Error(`Missing '${id}' in slug's url`);
                }
              },
            );

            return singleN({
              url,
              transparent: true,
            });
          },
        };
      });
    });
}

