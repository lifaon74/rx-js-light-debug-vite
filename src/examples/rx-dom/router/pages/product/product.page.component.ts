import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lirx/dom';
import { AppMenuPageComponent } from '../components/menu/menu.component';
import { eq$$, IObservable, let$$, map$$, single } from '@lirx/core';
import { AppVirtualLinkComponent, getRouteParams } from '@lirx/router';


/** COMPONENT **/

interface IData {
  readonly productId$: IObservable<string>;
  readonly productIds$: IObservable<readonly string[]>;
  readonly single: typeof single;
  readonly eq$$: typeof eq$$;
}


@Component({
  name: 'app-product-page',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <div class="header">
        Product page
      </div>
      <app-menu></app-menu>
      
      <div class="current-product-id-container">
        Current product id: {{ $.productId$ }}
      </div>
  
      <ul>
        <li *for="let productId of $.productIds$">
           <a
             is="v-link"
             [href]="'./product/' + productId"
             [replaceState]="true"
           >
            Product: {{ $.single(productId) }}
            <rx-container *if="$.eq$$($.single(productId), $.productId$)">
              -> Selected
            </rx-container>
           </a>
        </li>
      </ul>
    `,
    customElements: [
      AppMenuPageComponent,
      AppVirtualLinkComponent,
    ],
  }),
})
export class AppProductPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();

    const params$ = getRouteParams(this);

    const $productIds$ = let$$(Array.from({ length: 1e1 }, (v: any, i: number) => `${i}`));
    const productIds$ = $productIds$.subscribe;

    // params$((params: IRouteParams) => {
    //   console.log('params', params);
    // });

    const productId$ = map$$(params$, params => params.productId);

    this.data = {
      productId$,
      productIds$,
      single,
      eq$$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
