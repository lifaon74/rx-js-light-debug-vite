import { Path } from '../path/path.class';
import { IResolvedRXRoutes, IRXRoute } from './rx-route.type';
import { convertRoutePathToRegExp } from '../route/convert-route-path-to-reg-exp';


// export function createRXRouteResolver(
//   routes: ArrayLike<ILazyRXRoute>,
// ): IRXRouteResolver {
//   return (path: Path): Promise<IRXRouteResolverResult | null> => {
//     return resolveRXRoute(routes, path);
//   };
// }

export function resolveRXRoute(
  routes: ArrayLike<IRXRoute>,
  path: Path,
): IResolvedRXRoutes {
  for (let i = 0, l = routes.length; i < l; i++) {
    const route: IRXRoute = routes[i];
    const routePath: Path = route.path;
    const regExp: RegExp = convertRoutePathToRegExp(routePath);
    const match: RegExpExecArray | null = regExp.exec(path.toString());

    if (match !== null) {
      const remainingPath: Path = new Path(path.toString().slice(match[0].length));

      if (route.children) {
        const result: IResolvedRXRoutes = resolveRXRoute(route.children, remainingPath);
        if (result.length !== 0) {
          return [
            {
              ...route,
              params: match.groups,
            },
            ...result,
          ];
        }
      } else {
        if (remainingPath.toString() === '/') {
          return [
            {
              ...route,
              params: match.groups,
            }
          ];
        }
      }
    }
  }
  return [];
}

// export function makeResolvedRXRouteSync(
//   route: IResolvedRXRoute,
//   signal: AbortSignal,
// ): Promise<IResolvedRXRouteSync> {
//   return resolveRXRouteExtraProp(route.extra, signal)
//     .then(wrapFunctionWithAbortSignalAndThrow((extra: IRXRouteExtra): IResolvedRXRouteSync => {
//       return {
//         ...route,
//         extra,
//       } as IResolvedRXRouteSync;
//     }, signal));
// }
//
// export function makeResolvedRXRoutesSync(
//   routes: IResolvedRXRoutes,
//   signal: AbortSignal,
// ): Promise<IResolvedRXRoutesSync> {
//   return abortSignalPromiseBranching(signal, () => Promise.all(
//     routes.map((route: IResolvedRXRoute) => {
//       return makeResolvedRXRouteSync(route, signal);
//     })
//   ));
// }
