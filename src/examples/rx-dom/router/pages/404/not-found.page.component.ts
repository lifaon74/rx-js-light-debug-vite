import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppVirtualLinkComponent } from '../../components/virtual-link/virtual-link.component';

export const APP_NOT_FOUND_PAGE_CUSTOM_ELEMENTS = [
  AppVirtualLinkComponent,
];

/** COMPONENT **/

interface IData {
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_NOT_FOUND_PAGE_CUSTOM_ELEMENTS),
};

@Component({
  name: 'app-not-found-page',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div class="header">
       404 not found
    </div>
    <a is="v-link" href="/home">
      Home
    </a>
  `, CONSTANTS_TO_IMPORT),
})
export class AppNotFoundPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();
    this.data = {};
  }

  public onCreate(): IData {
    return this.data;
  }
}
