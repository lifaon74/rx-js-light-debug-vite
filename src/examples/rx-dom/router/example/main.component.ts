import {
  createUnicastSource, fromAnimationFrame, IObservable, IObserver, IUnsubscribe, let$$, map$$, mergeMapS$$, single,
  timeout,
} from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate, setReactiveClass,
} from '@lirx/dom';
import { NODE_REFERENCE_MODIFIER } from '../../material/modifiers/node-reference.modifier';
import { APP_ROUTES } from './routes';
import { MatProgressBarComponent } from '../../material/components/progress/progress-bar/mat-progress-bar.component';
import { createRXRouter, IRXRouterNavigationState } from '@lirx/router';
import { APP_ROUTES_ASYNC } from './routes-async';

function createFakeProgressObservable(
  timeConstant: number,
): IObservable<number> {
  return (emit: IObserver<number>): IUnsubscribe => {
    const startTimestamp: number = Date.now();

    return fromAnimationFrame()(() => {
      const elapsedTime: number = Date.now() - startTimestamp;
      const ratio: number = elapsedTime / timeConstant;
      // const progress: number = 1 - Math.exp(-ratio);
      const progress: number = 1 - (1 / (ratio + 1));
      emit(progress);
    });
  };
}


/** COMPONENT **/

interface IData {
  readonly $routerOutletElement: IObserver<HTMLElement>;
  readonly progress$: IObservable<IObservable<number>>;
}


@Component({
  name: 'app-main',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <mat-progress-bar
        class="loader"
        [progress$]="$.progress$"
      ></mat-progress-bar>
      
      <div
        rx-router-outlet
        $ref="[$.$routerOutletElement]"
      ></div>
    `,
    customElements: [
      MatProgressBarComponent,
    ],
    modifiers: [
      NODE_REFERENCE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
      position: relative;
    }

    :host > .loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      border: 0;
      border-radius: 0;
      color: transparent;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    }

    :host:not(.loading) > .loader {
      display: none;
    }
  `)],
})
export class AppMainComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();

    // const routes = APP_ROUTES_ASYNC;
    const routes = APP_ROUTES;

    const { emit: $progress, subscribe: progress$ } = let$$<IObservable<number>>();

    const { emit: $routerOutletElement, subscribe: routerOutletElement$ } = createUnicastSource<HTMLElement>();

    routerOutletElement$((routerOutletElement: HTMLElement) => {
      const router = createRXRouter({
        routes,
        routerOutletElement,
      });

      router.error$(_ => console.error(_));
      // router.state$(_ => console.log(_));

      const loading$ = mergeMapS$$(router.state$, (state: IRXRouterNavigationState) => {
        return (state === 'updating')
          ? map$$(timeout(200), () => true)
          : single(false);
      });

      const _progress$ = mergeMapS$$(loading$, (loading: boolean): IObservable<number> => {
        return loading
          ? createFakeProgressObservable(2000)
          : single(0);
      });

      $progress(_progress$);

      setReactiveClass(loading$, this, 'loading');

      (window as any).router = router;
    });

    this.data = {
      $routerOutletElement,
      progress$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
