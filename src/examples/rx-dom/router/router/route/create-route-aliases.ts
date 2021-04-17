import { IGenericRoute, IRoutePath } from './route.type';
import { Path } from '../path/path.class';



export function createRouteAliases<GRoute extends IGenericRoute>(
  paths: readonly IRoutePath[],
  route: Omit<GRoute, 'path'>,
): GRoute[] {
  return paths.map((path: Path): GRoute => {
    return {
      ...route,
      path,
    } as GRoute;
  });
}
