import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';

/** COMPONENT **/

interface IData {
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

// @Page({
//   path: new Path('/sub'),
// })
@Component({
  name: 'app-sub-list-page',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div class="header">
      Sub-list page
    </div>
  `, CONSTANTS_TO_IMPORT),
})
export class AppSubListPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();
    this.data = {};
  }

  public onCreate(): IData {
    return this.data;
  }
}
