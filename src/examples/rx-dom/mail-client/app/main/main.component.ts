import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
  subscribeOnNodeConnectedTo,
} from '@lirx/dom';
// @ts-ignore
import html from './main.component.html?raw';
// @ts-ignore
import style from './main.component.scss?inline';
import {
  distinct$$, fromEventTarget, IObservable, IObserver, let$$, map$$, merge, not$$, reference, throttleTime$$,
} from '@lirx/core';
import { MatToolbarComponent } from '../../../material/components/toolbar-container/toolbar/mat-toolbar.component';
import { MatToolbarContainerComponent } from '../../../material/components/toolbar-container/mat-toolbar-container.component';
import { MatIconsDemoComponent } from '../../../material/icons/mat-icons-demo/mat-icons-demo.component';
// import { MatIconMenuComponent } from '@lirx/mdi';
import {
  IMatSidenavComponentMode,
  IMatSidenavComponentUserCloseEvent, MatSidenavContainerComponent,
} from '../../../material/components/sidenav-container/mat-sidenav-container.component';
import { MatButtonComponent } from '../../../material/components/buttons/button/mat-button.component';
import { MatRippleComponent } from '../../../material/components/buttons/ripple/mat-ripple.component';

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
      // MatIconMenuComponent,
      MatButtonComponent,
      MatRippleComponent,
      // MatIconsDemoComponent,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppMainComponent extends HTMLElement implements OnCreate<IData> {
  public onCreate(): IData {
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

    return {
      sidenavOpened$,
      sidenavMode$,
      sidenavHasBackdrop$,
      menuButtonVisible$,

      onUserCloseSidenav,
      onClickMenuButton,
    };
  }
}
