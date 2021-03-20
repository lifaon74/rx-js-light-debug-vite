import { getDocument, HTMLElementConstructor, nodeAppendChild, nodeRemoveChildren } from '@lifaon/rx-dom';
import { AppProgressBarComponent } from '../progress-bar/progress-bar.component';
import { AppProgressRingComponent } from '../progress-ring/progress-ring.component';

export function normalizePath(
  path: string,
): string {
  return new URL(path, window.origin).pathname;
}

export class Path {
  protected _path: string;

  constructor(
    path: string,
  ) {
    this._path = normalizePath(path);
  }

  toString(): string {
    return this._path;
  }
}


/*------------*/

function wrapPathSegment(
  pattern: string,
): string {
  return `(^|\\/)${ pattern }($|\\/)`;
}

export function convertRoutePathToRegExpPattern(
  path: Path,
): string {
  return '^' + path.toString()
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

/*------------*/


export type IRoutePath = Path;

export interface IRoute<GExtra> {
  path: IRoutePath;
  children?: IRoute<GExtra>[];
  extra?: GExtra;
}

// export interface IRouteResolver<GReturn> {
//   (path: Path): Promise<GReturn | null>;
// }

/*------------*/

export type IRXRouteComponent = HTMLElementConstructor;

export interface IRXRouteExtra {
  component?: IRXRouteComponent;
  routerOutlet?: string;
}

export type ILazyRXRouteExtra = () => Promise<IRXRouteExtra>;

export type IRXRouteExtraProp = ILazyRXRouteExtra | IRXRouteExtra;

export type IRXRoute = IRoute<IRXRouteExtraProp>;

export interface IResolvedRXRoute extends IRXRoute {
  params?: IResolvedRXRouteParams;
}

export interface IResolvedRXRouteParams {
  [key: string]: string;
}

export type IResolvedRXRoutes = readonly IResolvedRXRoute[];

// export type IRXRouteResolver = IRouteResolver<IRXRouteResolverResult>;

/*------------*/

export function resolveRXRouteExtraProp(
  extra: IRXRouteExtraProp | undefined,
): Promise<IRXRouteExtra> {
  return (extra === void 0)
    ? Promise.resolve<IRXRouteExtra>({})
    : (
      (typeof extra === 'function')
        ? extra()
        : Promise.resolve(extra)
    );
}

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


/*------------*/

function getRouterOutlet(
  routerOutlet: string | undefined,
) {
  return routerOutlet ?? 'rx-router-outlet';
}

function locateRouterElement(
  optionalRouterOutlet: string | undefined,
  parentNode: ParentNode,
): Element | never {
  const routerOutlet: string = getRouterOutlet(optionalRouterOutlet);
  const routerElement: Element | null = parentNode.querySelector(routerOutlet);
  if (routerElement === null) {
    throw new Error(`Unable to locate router element '${ routerOutlet }'`);
  } else {
    return routerElement;
  }
}

function areEquivalentRXRouteExtra(
  extraA: IRXRouteExtra,
  extraB: IRXRouteExtra,
): boolean {
  return (getRouterOutlet(extraA.routerOutlet) === getRouterOutlet(extraB.routerOutlet))
    && (extraA.component === extraB.component);
}

export async function injectRXRoute(
  routes: IResolvedRXRoutes,
  previousRoutes: IResolvedRXRoutes = [],
  parentNode: ParentNode = getDocument(),
): Promise<void> {
  let routerElement: Element | undefined;
  let i: number = 0;

  for (const l: number = previousRoutes.length; i < l; i++) {
    const previousRoute: IResolvedRXRoute = previousRoutes[i];
    const route: IResolvedRXRoute | undefined = routes[i];
    const previousRouteExtra: IRXRouteExtra = await resolveRXRouteExtraProp(previousRoute.extra);
    const routeExtra: IRXRouteExtra = await resolveRXRouteExtraProp(route.extra);
    if (previousRouteExtra.component !== void 0) {
      routerElement = locateRouterElement(previousRouteExtra.routerOutlet, parentNode);
    }

    if (
      (route !== void 0)
      && areEquivalentRXRouteExtra(previousRouteExtra, routeExtra)
    ) {
      if (routerElement !== void 0) {
        parentNode = routerElement;
      }
    } else {
      if (routerElement !== void 0) {
        console.log('remove');
        nodeRemoveChildren(routerElement);
      }
      break;
    }
  }

  for (const l: number = routes.length; i < l; i++) {
    const route: IResolvedRXRoute = routes[i];
    const routeExtra: IRXRouteExtra = await resolveRXRouteExtraProp(route.extra);
    const componentConstructor: HTMLElementConstructor | undefined = routeExtra.component;
    if (componentConstructor !== void 0) {
      routerElement = locateRouterElement(routeExtra.routerOutlet, parentNode);
      parentNode = routerElement;
      nodeAppendChild(routerElement, new componentConstructor());
    }
  }
}

/*------------*/

class RXRouter {
  public readonly routes: ArrayLike<IRXRoute>;
  protected _resolvedRoutes: IResolvedRXRoutes;

  constructor(
    routes: ArrayLike<IRXRoute>,
  ) {
    this.routes = routes;
    this._resolvedRoutes = [];
  }

  get resolvedRoutes(): IResolvedRXRoutes {
    return this._resolvedRoutes;
  }

  update(
    path: Path,
  ): Promise<void> {
    const resolvedRoutes: IResolvedRXRoutes = resolveRXRoute(routes, path)
    console.log(resolvedRoutes);
    const previousResolvedRoutes: IResolvedRXRoutes = this._resolvedRoutes;
    this._resolvedRoutes = resolvedRoutes;
    return injectRXRoute(resolvedRoutes, previousResolvedRoutes);
  }
}


/*-----------------*/

const routes: IRXRoute[] = [
  {
    path: new Path('/all'),
    extra: {
      component: AppProgressBarComponent,
    },
  },
  {
    path: new Path('/all2'),
    extra: {
      component: AppProgressBarComponent,
    },
  },
  {
    path: new Path('/single/:id'),
    children: [
      {
        path: new Path('/a'),
        extra: async () => {
          return {
            component: (await import('../progress-ring/progress-ring.component')).AppProgressRingComponent,
          };
        },
      },
      {
        path: new Path('/**'),
        extra: {
          component: AppProgressBarComponent,
        },
      },
    ],
  },
  {
    path: new Path('/child'),
    // component: AppProgressBarComponent,
    children: [
      {
        path: new Path('/1'),
        // component: AppProgressBarComponent,
      },
    ],
  },
];

/*-----------------*/


export async function routerExample() {

  // console.log(convertRoutePathToRegExp('/abc'));
  // console.log(convertRoutePathToRegExp('/:id'));
  // console.log(convertRoutePathToRegExp('/**'));
  // console.log(convertRoutePathToRegExp('/*'));
  // console.log(convertRoutePathToRegExp('/abc/:id/*/ijk/**'));

  document.body.innerHTML = `
    <rx-router-outlet></rx-router-outlet>
  `;

  // const path = '/all';
  // const path = '/single/abc';
  // const path = '/single/abc/a';
  // const path = '/single/abc/b';
  // const path = '/child';

  // const resolvedRoutes = await resolveRXRoute(routes, new Path(path));
  // console.log(resolvedRoutes);
  // await injectRXRoute(resolvedRoutes);

  const router = new RXRouter(routes);
  // await router.update(new Path('/all'));
  // await router.update(new Path('/all2'));
  // await router.update(new Path('/single'));
  // await router.update(new Path('/single/10/a'));
  await router.update(new Path('/single/10/a'));

}

