import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppVirtualLinkComponent } from '../../../components/virtual-link/virtual-link.component';
import { single } from '@lifaon/rx-js-light';

const APP_MENU_PAGE_CUSTOM_ELEMENTS = [
  AppVirtualLinkComponent,
];

/** COMPONENT **/

interface IData {
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_MENU_PAGE_CUSTOM_ELEMENTS),
  single,
};

@Component({
  name: 'app-menu',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <ul>
       <li>
         <a is="v-link" href="./home">Home</a>
      </li>
      <li>
         <a is="v-link" href="./product/0">Products</a>
      </li>
      <li>
         <a is="v-link" href="./list">List</a>
      </li>
      <li>
         <a is="v-link" href="./list/sub">Sub-list</a>
      </li>
      <li>
         <a is="v-link" href="./forbidden">Forbidden</a>
      </li>
<!--      <li>-->
<!--         <a is="v-link" href="/list" target="_blank">List page (new tab)</a>-->
<!--      </li>-->
<!--      <li>-->
<!--         <a is="v-link" href="mailto:bob@alice.com">Email</a>-->
<!--      </li>-->
    </ul>
  `, CONSTANTS_TO_IMPORT),
})
export class AppMenuPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();
    this.data = {};
  }

  public onCreate(): IData {
    return this.data;
  }
}
