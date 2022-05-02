import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
  subscribeOnNodeConnectedTo,
} from '@lirx/dom';
// @ts-ignore
import html from './main.component.html?raw';
// @ts-ignore
import style from './main.component.scss?inline';
import {
  IMatSidenavComponentMode, IMatSidenavComponentUserCloseEvent, MatSidenavContainerComponent,
} from '../../../material/sidenav/mat-sidenav-container.component';
import {
  distinct$$, fromEventTarget, IObservable, IObserver, let$$, map$$, merge, not$$, reference, throttleTime$$,
} from '@lirx/core';
import { MatToolbarComponent } from '../../../material/toolbar-container/toolbar/mat-toolbar.component';
import { MatToolbarContainerComponent } from '../../../material/toolbar-container/mat-toolbar-container.component';
import { MatIconAbTestingComponent, MatIconsDemoComponent } from '@lirx/mdi';

/** COMPONENT **/

interface IData {
  readonly sidenavOpened$: IObservable<boolean>;
  readonly sidenavMode$: IObservable<IMatSidenavComponentMode>;
  readonly sidenavHasBackdrop$: IObservable<boolean>;
  readonly menuButtonVisible$: IObservable<boolean>;
  readonly onUserCloseSidenav: IObserver<IMatSidenavComponentUserCloseEvent>;
  readonly onClickMenuButton: IObserver<MouseEvent>;
}


@Component({
  name: 'app-main',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatSidenavContainerComponent,
      MatToolbarContainerComponent,
      MatToolbarComponent,
      // MatIconAbTestingComponent,
      MatIconsDemoComponent,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppMainComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();

    const windowSize$ = throttleTime$$(fromEventTarget(window, 'resize'), 100);

    // TODO use createWindowSizeObservableInitialized ?
    const isLargeWindow = () => (window.innerWidth > 950);
    const isLargeWindow$ = distinct$$(
      merge([
        reference(isLargeWindow),
        map$$(windowSize$, isLargeWindow),
      ]),
    );

    const {
      emit: $sidenavOpened,
      subscribe: sidenavOpened$,
      getValue: getSidenavOpened,
    } = let$$(false);

    const onUserCloseSidenav = (): void => {
      $sidenavOpened(false);
    };

    const onClickMenuButton = (): void => {
      $sidenavOpened(!getSidenavOpened());
    };

    subscribeOnNodeConnectedTo(this, isLargeWindow$, $sidenavOpened);

    const sidenavMode$ = map$$(isLargeWindow$, (isLargeWindow: boolean): IMatSidenavComponentMode => {
      return isLargeWindow
        ? 'push'
        : 'over';
    });

    const sidenavHasBackdrop$ = not$$(isLargeWindow$);

    const menuButtonVisible$ = not$$(isLargeWindow$);

    this.data = {
      sidenavOpened$,
      sidenavMode$,
      sidenavHasBackdrop$,
      menuButtonVisible$,

      onUserCloseSidenav,
      onClickMenuButton,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
