import {
  compileReactiveCSSAsComponentStyle, compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, createDocumentFragment,
  DEFAULT_CONSTANTS_TO_IMPORT, getFirstElementChild, IReactiveContent, nodeAppendChild, OnConnect, OnCreate,
  OnDisconnect, onNodeConnectedToWithImmediateCached
} from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, createUnicastReplayLastSource, debounceFrameSubscribePipe, IEmitFunction,
  IMulticastReplayLastSource, ISubscribeFunction, ISubscription, IUnicastReplayLastSource, mapSubscribePipe, of,
  pipeSubscribeFunction, Subscription
} from '@lifaon/rx-js-light';
import { AppModalComponent } from '../modal.component';
import { IAppModalComponentConstructor } from '../app-modal-component-constructor.type';
// @ts-ignore
import style from './modal-manager.component.scss';
// @ts-ignore
import html from './modal-manager.component.html?raw';
// // @ts-ignore
// import htmlURL from './modal-manager.component.html?url';


interface IModal {
  component: AppModalComponent;
  template: IReactiveContent;
  visible: ISubscribeFunction<boolean>;
}

/*-----------*/

interface IData {
  readonly modals: IMulticastReplayLastSource<readonly IModal[]>;
  readonly onClickModalContainer: IEmitFunction<MouseEvent>;
}


const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-modal-manager',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppModalManagerComponent extends HTMLElement implements OnCreate<IData>, OnConnect, OnDisconnect {
  protected readonly data: IData;
  protected readonly isVisibleSubscription: ISubscription<boolean>;

  constructor() {
    super();
    const modals: IMulticastReplayLastSource<readonly IModal[]> = createMulticastReplayLastSource<readonly IModal[]>({ initialValue: [] });

    this.data = {
      modals,
      onClickModalContainer: (event: MouseEvent): void => {
        if (event.currentTarget === event.target) {
          (getFirstElementChild<AppModalComponent>(event.target as Element) as AppModalComponent).close('backdrop');
        }
      },
    };

    this.isVisibleSubscription = new Subscription(
      pipeSubscribeFunction(modals.subscribe, [
        mapSubscribePipe<readonly IModal[], boolean>((modals: readonly IModal[]) => (modals.length > 0)),
      ]),
      (isVisible: boolean) => {
        this.classList.toggle('visible', isVisible);
      }
    );
  }

  open<GModalComponent extends AppModalComponent, GData>(
    componentConstructor: IAppModalComponentConstructor<GModalComponent, GData>,
    data: GData,
  ): GModalComponent {
    const component: GModalComponent = new componentConstructor(this, data);

    const fragment: DocumentFragment = createDocumentFragment();
    nodeAppendChild(fragment, component);

    const visible: IUnicastReplayLastSource<boolean> = createUnicastReplayLastSource<boolean>({ initialValue: false });

    const unsubscribe = pipeSubscribeFunction(onNodeConnectedToWithImmediateCached(component), [
      debounceFrameSubscribePipe(),
    ])((connected: boolean) => {
      if (connected) {
        visible.emit(true);
        unsubscribe();
      }
    });

    const modal: IModal = {
      component,
      template: of(fragment),
      visible: visible.subscribe,
    };

    this.mutateModalsArray((modals: IModal[]) => {
      modals.push(modal);
    });

    return component;
  }

  close(
    component: AppModalComponent,
  ): void {
    const index: number = this.data.modals.getValue().findIndex((modal: IModal) => {
      return modal.component === component;
    });

    if (index === -1) {
      throw new Error(
        (component.manager === this)
          ? `Modal already closed`
          : `Not a modal of this manager`
      );
    } else {
      this.mutateModalsArray((modals: IModal[]) => {
        modals.splice(index, 1);
      });
    }
  }

  onCreate(): IData {
    return this.data;
  }

  onConnect(): void {
    this.isVisibleSubscription.activate();
  }

  onDisconnect(): void {
    this.isVisibleSubscription.deactivate();
  }

  protected mutateModalsArray(callback: (modals: IModal[]) => void): void {
    const modals: readonly IModal[] = this.data.modals.getValue();
    callback(modals as IModal[]);
    this.data.modals.emit(modals);
  }
}

