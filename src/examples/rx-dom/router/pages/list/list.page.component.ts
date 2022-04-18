import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lirx/dom';
import { INavigation, NAVIGATION } from '@lirx/router';
import { idle, IObservable, map$$ } from '@lirx/core';
import { AppMenuPageComponent } from '../components/menu/menu.component';

/** COMPONENT **/

interface IData {
  readonly navigation: INavigation;
  readonly canBack$: IObservable<boolean>;
}

@Component({
  name: 'app-list-page',
  template: compileReactiveHTMLAsComponentTemplate({
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
      <div rx-router-outlet></div>
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
