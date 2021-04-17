import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, generateCreateElementFunctionWithRouterOutlet, OnCreate
} from '@lifaon/rx-dom';
import { INavigation, NAVIGATION } from '../../navigation/navigation';
import { idle, ISubscribeFunction } from '@lifaon/rx-js-light';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { AppMenuPageComponent } from '../components/menu/menu.component';
import { generateRouterOutletHTML } from '../../router/rx/rx-router-outlet';

export const APP_LIST_PAGE_CUSTOM_ELEMENTS = [
  AppMenuPageComponent,
];

/** COMPONENT **/

interface IData {
  navigation: INavigation;
  canBack$: ISubscribeFunction<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithRouterOutlet('rx-router-outlet', generateCreateElementFunctionWithCustomElements(APP_LIST_PAGE_CUSTOM_ELEMENTS)),
};

@Component({
  name: 'app-list-page',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
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
  `, CONSTANTS_TO_IMPORT),
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
