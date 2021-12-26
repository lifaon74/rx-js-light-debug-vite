import { compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { AppVirtualLinkComponent } from '../../components/virtual-link/virtual-link.component';


/** COMPONENT **/

interface IData {
}

@Component({
  name: 'app-not-found-page',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="header">
         404 not found
      </div>
      <a is="v-link" href="./home">
        Home
      </a>
    `,
    customElements: [
      AppVirtualLinkComponent,
    ],
  }),
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
