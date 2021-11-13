import { compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { INavigation, NAVIGATION } from '../../navigation/navigation';
import { idle, IObservable, map$$ } from '@lifaon/rx-js-light';
import { AppMenuPageComponent } from '../components/menu/menu.component';
import { generateRouterOutletHTML } from '../../router/router-outlet/rx-router-outlet';

/** COMPONENT **/

interface IData {
  readonly navigation: INavigation;
  readonly canBack$: IObservable<boolean>;
}

// @Page({
//   path: new Path('/list'),
//   isEndPoint: true,
//   children: () => {
//     return Promise.all([
//       import('../sub-list/sub-list.page.component').then(_ => _.AppSubListPageComponent),
//     ]);
//   },
// })
@Component({
  name: 'app-list-page',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="header">
        List page
      </div>
      
      <div
        *if="$.canBack$"
        class="back"
        (click)="$.navigation.back"
      >
        Back
      </div>
      
      <app-menu></app-menu>
      ${ generateRouterOutletHTML() }
    `,
    customElements: [
      AppMenuPageComponent,
    ],
  }),
})
export class AppListPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();

    const canBack$ = map$$(idle(), () => NAVIGATION.canBack());

    this.data = {
      navigation: NAVIGATION,
      canBack$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
