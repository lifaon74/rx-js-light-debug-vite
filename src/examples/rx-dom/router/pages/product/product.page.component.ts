import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppMenuPageComponent } from '../components/menu/menu.component';
import { IReadonlyMulticastReplayLastSource, ISubscribeFunction, single } from '@lifaon/rx-js-light';
import { let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';

const APP_PRODUCT_PAGE_CUSTOM_ELEMENTS = [
  AppMenuPageComponent,
];

/** COMPONENT **/

interface IData {
  readonly productId$: ISubscribeFunction<string>;
  readonly productIds$: ISubscribeFunction<readonly string[]>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_PRODUCT_PAGE_CUSTOM_ELEMENTS),
  single,
};

@Component({
  name: 'app-product-page',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
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
           [attr.replace-state]="single(true)"
         >Product: {{ single(productId) }}</a>
      </li>
    </ul>
  `, CONSTANTS_TO_IMPORT),
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
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
