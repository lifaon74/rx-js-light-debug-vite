import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { AppVirtualLinkComponent, LINK_MODIFIER } from '@lifaon/rx-router';


/** COMPONENT **/

interface IData {
}


@Component({
  name: 'app-menu',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <ul>
         <li>
<!--           <a is="v-link" href="./home">Home</a>-->
           <a $link="['./home']">Home</a>
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
           <a is="v-link" href="./list/async">List async</a>
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
    `,
    customElements: [
      AppVirtualLinkComponent,
    ],
    modifiers: [
      LINK_MODIFIER,
    ],
  }),
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
