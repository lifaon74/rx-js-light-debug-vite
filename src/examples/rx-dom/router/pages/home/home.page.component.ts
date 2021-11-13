import {
  compileReactiveHTMLAsGenericComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppMenuPageComponent } from '../components/menu/menu.component';

const APP_HOME_PAGE_CUSTOM_ELEMENTS = [
  AppMenuPageComponent,
];

/** COMPONENT **/

interface IData {
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_HOME_PAGE_CUSTOM_ELEMENTS),
};

// @Page({
//   path: new Path('/home'),
// })
@Component({
  name: 'app-home-page',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="header">
        Home page
      </div>
      <app-menu/>
    `,
  }),
})
export class AppHomePageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();
    this.data = {};
  }

  public onCreate(): IData {
    return this.data;
  }
}
