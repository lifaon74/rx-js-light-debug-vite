import {
  fromPromiseFactory, IDefaultNotificationsUnion, interval, IObservable, IObserver, let$$, map$$, merge, mergeMapS$$,
  not$$, raceWithNotifications,
  single, throwError,
  timeout,
} from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate, Component,
  customElementObservable, IComponentTemplate, ICustomElementConstructorOrView, OnCreate,
} from '@lirx/dom';

/** ASYNC COMPONENT **/

const AppAsyncComponentLoadedComponent$ = fromPromiseFactory(() => import('../async-loaded/async-loaded.component').then(_ => _.AppAsyncComponentLoadedComponent));

/** DATA **/

interface IData {
  readonly visible$: IObservable<boolean>;
  readonly $onClickShowComponentButton: IObserver<Event>;
  readonly $onClickCancelLoadingButton: IObserver<Event>;

  readonly loadingState$: IObservable<IDefaultNotificationsUnion<any>>;
  readonly value$: IObservable<string>;
}


/** TEMPLATE **/

const customElements: ICustomElementConstructorOrView[] = [
  customElementObservable('app-async-loaded-component', AppAsyncComponentLoadedComponent$),
];

const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
  html: `
    <rx-if condition=$.visible$>
      <button
        *if-false
        (click)="$.$onClickShowComponentButton"
      >
        Show async component
      </button>

      <rx-if-true>
        <button
          (click)="$.$onClickCancelLoadingButton"
        >
          Cancel loading
        </button>

        <rx-async expression="$.loadingState$">
          <progress *async-pending></progress>

          <app-async-loaded-component
            *async-fulfilled
            [value]="$.value$"
          ></app-async-loaded-component>

          <div *async-rejected="error">
            {{ error.message }}
          </div>
        </rx-async>
      </rx-if-true>
    </rx-if>
  `,
  customElements
});

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-async expression="$.loadingState$">
//       <rx-async-pending>
//         <progress></progress>
//       </rx-async-pending>
//
//       <rx-async-fulfilled>
//         <app-async-loaded-component
//           [value]="$.value$"
//         ></app-async-loaded-component>
//       </rx-async-fulfilled>
//
//       <rx-async-rejected
//         let-value="error"
//       >
//         {{ error.message }}
//       </rx-async-rejected>
//     </rx-async>
//   `,
//   customElements
// });

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-template name="pendingTemplate">
//       <progress></progress>
//     </rx-template>
//
//     <rx-template name="fulfilledTemplate">
//        <app-async-loaded-component
//           [value]="$.value$"
//         ></app-async-loaded-component>
//     </rx-template>
//
//     <rx-template
//       name="rejectedTemplate"
//       let-value="error"
//     >
//       {{ error.message }}
//     </rx-template>
//
//     <rx-async
//       expression="$.loadingState$"
//       pending="pendingTemplate"
//       fulfilled="fulfilledTemplate"
//       rejected="rejectedTemplate"
//     ></rx-async>
//   `,
//   customElements
// });

// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <app-async-loaded-component
//       *async="$.loadingState$"
//       [value]="$.value$"
//     ></app-async-loaded-component>
//   `,
//   customElements
// });

/** COMPONENT **/

@Component({
  name: 'app-rx-async-example',
  template,
})
export class AppRxAsyncExampleComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    const { emit: $visible, subscribe: visible$ } = let$$<boolean>(false);
    const { emit: $cancelLoading, subscribe: cancelLoading$ } = let$$<void>();

    const $onClickShowComponentButton = (): void => {
      $visible(true);
    };

    const $onClickCancelLoadingButton = (): void => {
      $cancelLoading();
    };


    const loadComponent$ = mergeMapS$$(timeout(2000), () => AppAsyncComponentLoadedComponent$);
    const abortComponentLoading$ = mergeMapS$$(cancelLoading$, () => throwError(new Error(`Aborted`)));
    // const abortComponentLoading$ = mergeMapS$$(timeout(1000), () => throwError(new Error(`Aborted`)));

    const loadingState$ = raceWithNotifications([
      loadComponent$,
      abortComponentLoading$,
    ]);


    const value$ = map$$(merge([interval(1000), single(void 0)]), () => new Date().toISOString());

    this._data = {
      visible$,
      $onClickShowComponentButton,
      $onClickCancelLoadingButton,
      loadingState$,
      value$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
