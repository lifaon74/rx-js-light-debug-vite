import { compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';

/** COMPONENT **/

interface IData {
}


// @Page({
//   path: new Path('/sub'),
// })
@Component({
  name: 'app-sub-list-page',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="header">
        Sub-list page
      </div>
    `,
  }),
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
