import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lirx/dom';
import { AppMenuPageComponent } from '../components/menu/menu.component';


/** COMPONENT **/

interface IData {
}


@Component({
  name: 'app-home-page',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <div class="header">
        Home page
      </div>
      <app-menu/>
    `,
    customElements: [
      AppMenuPageComponent,
    ],
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
