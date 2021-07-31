import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  createDocumentFragment, DEFAULT_CONSTANTS_TO_IMPORT, getDocument, IReactiveContent, nodeAppendChild, OnCreate,
  querySelectorOrThrow,
  subscribeOnNodeConnectedTo
} from '@lifaon/rx-dom';
import {
  IMulticastReplayLastSource, ISubscribeFunction, mutateReadonlyReplayLastSourceArray, single
} from '@lifaon/rx-js-light';
import { MatOverlayComponent } from '../component/mat-overlay.component';
import { let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';

// @ts-ignore
import style from './mat-overlay-manager.component.scss';
// @ts-ignore
import html from './mat-overlay-manager.component.html?raw';
import { IMatOverlayComponentConstructor } from '../component/mat-overlay-component-constructor.type';
/** INTERFACES **/

interface IOverlay {
  readonly component: MatOverlayComponent;
  readonly content$: IReactiveContent;
}

interface IData {
  readonly overlays$: ISubscribeFunction<readonly IOverlay[]>;
}

/** COMPONENT **/

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'mat-overlay-manager',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatOverlayManagerComponent extends HTMLElement implements OnCreate<IData> {

  static getInstance(): MatOverlayManagerComponent {
    return querySelectorOrThrow(getDocument(), 'mat-overlay-manager');
  }

  protected readonly _data: IData;
  protected readonly _$overlays$: IMulticastReplayLastSource<readonly IOverlay[]>;

  constructor() {
    super();
    this._$overlays$ = let$$<readonly IOverlay[]>([]);
    const overlays$ = this._$overlays$.subscribe;

    this._data = {
      overlays$,
    };

    subscribeOnNodeConnectedTo(
      this,
      map$$<readonly IOverlay[], boolean>(overlays$, (overlays: readonly IOverlay[]) => (overlays.length > 0)),
      (isVisible: boolean) => {
        this.classList.toggle('visible', isVisible);
      },
    );
  }

  open<GOverlayComponent extends MatOverlayComponent, GArguments extends any[]>(
    componentConstructor: IMatOverlayComponentConstructor<GOverlayComponent, GArguments>,
    args: GArguments,
  ): GOverlayComponent {
    const component: GOverlayComponent = new componentConstructor(this, ...args);

    const fragment: DocumentFragment = createDocumentFragment();
    nodeAppendChild(fragment, component);

    const overlay: IOverlay = {
      component,
      content$: single(fragment),
    };

    mutateReadonlyReplayLastSourceArray(this._$overlays$, (overlays: IOverlay[]): void => {
      overlays.push(overlay);
    });

    return component;
  }

  close(
    component: MatOverlayComponent,
  ): void {
    const index: number = this._$overlays$.getValue().findIndex((overlay: IOverlay): boolean => {
      return overlay.component === component;
    });

    if (index === -1) {
      throw new Error(
        (component.manager === this)
          ? `Overlay already closed`
          : `Not a overlay of this manager`
      );
    } else {
      mutateReadonlyReplayLastSourceArray(this._$overlays$, (overlays: IOverlay[]): void => {
        overlays.splice(index, 1);
      });
    }
  }

  onCreate(): IData {
    return this._data;
  }
}

