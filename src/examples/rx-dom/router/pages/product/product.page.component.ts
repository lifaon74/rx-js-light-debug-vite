import { compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { AppMenuPageComponent } from '../components/menu/menu.component';
import { IReadonlyMulticastReplayLastSource, IObservable, single, map$$, eq$$, let$$ } from '@lifaon/rx-js-light';


/** COMPONENT **/

interface IData {
  readonly productId$: IObservable<string>;
  readonly productIds$: IObservable<readonly string[]>;
  readonly single: typeof single;
  readonly eq$$: typeof eq$$;
}


@Component({
  name: 'app-product-page',
  template: compileReactiveHTMLAsGenericComponentTemplate({
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
             [href]="single('./product/' + productId)"
             [replaceState]="$.single(true)"
           >
            Product: {{ single(productId) }}
            <rx-container *if="$.eq$$(single(productId), $.productId$)">
              Selected
            </rx-container>
           </a>
        </li>
      </ul>
    `,
    customElements: [
      AppMenuPageComponent,
    ],
  }),
})
export class AppProductPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor(
    $params$: IReadonlyMulticastReplayLastSource<{ productId: string }>,
  ) {
    super();

    const $productIds$ = let$$(Array.from({ length: 1e1 }, (v: any, i: number) => `${ i }`));
    const productIds$ = $productIds$.subscribe;

    // $params$.subscribe((params: IRouteParams) => {
    //   console.log('params', params);
    // });

    const productId$ = map$$($params$.subscribe, params => params.productId);

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
