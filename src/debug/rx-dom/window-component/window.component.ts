import {
  createDragObservable, IDragObject, IDragObservableNotifications
} from './create-drag-subscribe-function';
import {
  compileReactiveCSSAsComponentStyle, Component, DEFAULT_CONSTANTS_TO_IMPORT, DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
  getParentNode, loadCompileAndEvaluateReactiveHTMLAsComponentTemplate, OnConnect, OnCreate, OnDisconnect, OnInit,
  querySelectorOrThrow
} from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, freeze, IObserver, IMulticastReplayLastSource, IObservable,
  IUnsubscribe, noop, reactiveFunction, Subscription, SubscriptionManager,
} from '@lifaon/rx-js-light';
// @ts-ignore
import style from './window.component.scss';
// // @ts-ignore
// import html from './window.component.html';


function normalizeWidth(width: number): number {
  if (width < 0) {
    throw new RangeError(`width must be in the range: [0, Infinity[`);
  } else {
    return width;
  }
}

function computeRightFromLeftAndWidth(left: number, width: number): number {
  return (1 - left - width);
}

function computeLeftFromRightAndWidth(right: number, width: number): number {
  return (1 - right - width);
}

function computeWidthFromLeftAndRight(left: number, right: number): number {
  return Math.max(0, 1 - left - right);
}

function computeBottomFromTopAndHeight(top: number, height: number): number {
  return (1 - top - height);
}

/*---*/


function getContainerOfAppWindowComponent(
  instance: AppWindowComponent,
): HTMLElement {
  const container: HTMLElement | null = getParentNode<HTMLElement>(instance);
  if (container === null) {
    throw new Error(`Element <${ instance.tagName }> should have a parent element`);
  } else {
    return container;
  }
}


type IHorizontalPosition = 'left' | 'center' | 'right';
type IVerticalPosition = 'top' | 'center' | 'bottom';

// const drag = createDragObservable(this);
// drag((notification) => {
//   console.log('dragging', notification);
// });

function createResizeObservableForAppWindowComponent(
  instance: AppWindowComponent,
  horizontalPosition: IHorizontalPosition,
  verticalPosition: IVerticalPosition
): IObservable<never> {
  return (): IUnsubscribe => {
    let elementPositionX: number;
    let elementPositionY: number;

    const subscribeToDrag = createDragObservable(querySelectorOrThrow<HTMLDivElement>(
      instance,
      `:scope > .resize-container > .resize.${ verticalPosition }.${ horizontalPosition }`,
    ));

    const onDragStart = () => {
      elementPositionX = (horizontalPosition === 'left')
        ? instance.getLeft()
        : (
          (horizontalPosition === 'center')
            ? 0
            : instance.getRight()
        );
      // elementPositionY = (verticalPosition === 'top')
      //   ? instance.top
      //   : (
      //     (verticalPosition === 'center')
      //       ? 0
      //       : instance.bottom
      //   );
    };

    const onDragMove = (drag: IDragObject) => {
      const userBordersResize: IUserBordersResize | null = instance.getUserBorderResize();
      if (userBordersResize !== null) {
        const container: HTMLElement = getContainerOfAppWindowComponent(instance);
        const ratioX: number = (drag.delta.x / container.offsetWidth);
        const ratioY: number = (drag.delta.y / container.offsetHeight);

        if (horizontalPosition === 'left') {
          const left: number = ratioX + elementPositionX;
          const currentLeftPlusWidth: number = instance.getLeft() + instance.getWidth();
          const width: number = currentLeftPlusWidth - left;
          const clampedWidth: number = Math.max(userBordersResize.width.min, Math.min(userBordersResize.width.max, width));
          const clampedLeft: number = currentLeftPlusWidth - clampedWidth;
          instance.setWidthKeepingLeft(clampedWidth);
          instance.setLeftKeepingWidth(clampedLeft);

          // instance.setLeftKeepingRight(ratioX + elementPositionX);
        } else if (horizontalPosition === 'right') {
          const right: number = -ratioX + elementPositionX;
          const width: number = 1 - instance.getLeft() - right;
          const clampedWidth: number = Math.max(userBordersResize.width.min, Math.min(userBordersResize.width.max, width));
          instance.setWidthKeepingLeft(clampedWidth);
          // instance.setRightKeepingLeft(-ratioX + elementPositionX);
        }

        if (verticalPosition === 'top') {
          // instance.setTop(ratioY + elementPositionY, false);
        } else if (verticalPosition === 'bottom') {
          // instance.setBottom(-ratioY + elementPositionY, false);
        }
      }
    };

    return subscribeToDrag((notification: IDragObservableNotifications) => {
      switch (notification.name) {
        case 'drag-start':
          onDragStart();
          break;
        case 'drag-move':
          onDragMove(notification.value);
          break;
      }
    });
  };
}

function createAllResizeObservableForAppWindowComponent(
  instance: AppWindowComponent,
): IObservable<never> {
  const subscribe = [
    createResizeObservableForAppWindowComponent(instance, 'left', 'top'),
    createResizeObservableForAppWindowComponent(instance, 'left', 'center'),
    createResizeObservableForAppWindowComponent(instance, 'left', 'bottom'),

    createResizeObservableForAppWindowComponent(instance, 'right', 'top'),
    createResizeObservableForAppWindowComponent(instance, 'right', 'center'),
    createResizeObservableForAppWindowComponent(instance, 'right', 'bottom'),

    createResizeObservableForAppWindowComponent(instance, 'center', 'top'),
    createResizeObservableForAppWindowComponent(instance, 'center', 'bottom'),
  ];

  return (): IUnsubscribe => {
    const unsubscribe = subscribe.map((subscribe: IObservable<never>) => subscribe(noop));
    return () => {
      for (let i = 0, l = unsubscribe.length; i < l; i++) {
        unsubscribe[i]();
      }
    };
  };
}

function createMoveObservableForAppWindowComponent(
  instance: AppWindowComponent
): IObservable<never> {
  return (): IUnsubscribe => {
    let elementPositionX: number;
    let elementPositionY: number;

    const subscribeToDrag = createDragObservable(querySelectorOrThrow<HTMLDivElement>(
      instance,
      ':scope > .frame > .header',
    ));

    const onDragStart = () => {
      elementPositionX = instance.getLeft();
      // elementPositionY = instance.top;
    };


    const onDragMove = (drag: IDragObject) => {
      const container: HTMLElement = getContainerOfAppWindowComponent(instance);
      const ratioX: number = (drag.delta.x / container.offsetWidth);
      const ratioY: number = (drag.delta.y / container.offsetHeight);
      instance.setLeftKeepingWidth(ratioX + elementPositionX);
      // instance.setTopKeepingHeight(ratioY + elementPositionY);
    };

    return subscribeToDrag((notification: IDragObservableNotifications) => {
      switch (notification.name) {
        case 'drag-start':
          onDragStart();
          break;
        case 'drag-move':
          onDragMove(notification.value);
          break;
      }
    });
  };
}


/*---*/

export interface IMinMaxRange {
  readonly min: number;
  readonly max: number;
}

export function createMinMaxRange(
  min: number,
  max: number,
): IMinMaxRange {
  return freeze({
    min,
    max,
  });
}

export interface IUserBordersResize {
  readonly width: IMinMaxRange;
  readonly height: IMinMaxRange;
}


export const DEFAULT_USER_BORDERS_RESIZE: IUserBordersResize = freeze({
  width: createMinMaxRange(0.1, Number.POSITIVE_INFINITY),
  height: createMinMaxRange(0.1, Number.POSITIVE_INFINITY),
});


/*---*/


const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

// interface IWindowData {
//
// }

type IWindowData = any;

@Component({
  name: 'app-window',
  template: loadCompileAndEvaluateReactiveHTMLAsComponentTemplate<IWindowData>(
    // @ts-ignore
    new URL('./window.component.html', import.meta.url).href,
    CONSTANTS_TO_IMPORT,
  ),
  // template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html),
  // style: loadAndCompileReactiveCSSAsComponentStyle(
  //   // @ts-ignore
  //   new URL('./window.component.css', import.meta.url).href,
  // ),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppWindowComponent extends HTMLElement implements OnCreate<IWindowData>, OnConnect, OnDisconnect, OnInit {
  protected readonly data: IWindowData;
  protected readonly subscriptions: SubscriptionManager;

  /** HORIZONTAL **/
  protected readonly left: IMulticastReplayLastSource<number>;
  protected readonly width: IMulticastReplayLastSource<number>;
  protected readonly right: IObservable<number>;

  /** VERTICAL **/
  protected readonly top: IMulticastReplayLastSource<number>;
  protected readonly height: IMulticastReplayLastSource<number>;
  protected readonly bottom: IObservable<number>;

  /** OTHERS **/
  protected readonly userBorderResize: IMulticastReplayLastSource<IUserBordersResize | null>;
  protected readonly isMaximised: IObservable<boolean>;

  constructor() {
    super();
    this.subscriptions = new SubscriptionManager();

    /** HORIZONTAL **/

    this.left = createMulticastReplayLastSource<number>({ initialValue: 0.1 });
    this.width = createMulticastReplayLastSource<number>({ initialValue: 0.8 });

    this.right = reactiveFunction([this.left.subscribe, this.width.subscribe], computeRightFromLeftAndWidth);

    this.subscriptions.set('left', new Subscription(this.left.subscribe, (left: number) => {
      this.style.left = `${ left * 100 }%`;
    }));

    this.subscriptions.set('width', new Subscription(this.width.subscribe, (width: number) => {
      this.style.width = `${ width * 100 }%`;
    }));

    /** VERTICAL **/

    this.top = createMulticastReplayLastSource<number>({ initialValue: 0.1 });
    this.height = createMulticastReplayLastSource<number>({ initialValue: 0.8 });

    this.bottom = reactiveFunction([this.top.subscribe, this.height.subscribe], computeBottomFromTopAndHeight);

    this.subscriptions.set('top', new Subscription(this.top.subscribe, (top: number) => {
      this.style.top = `${ top * 100 }%`;
    }));

    this.subscriptions.set('height', new Subscription(this.height.subscribe, (height: number) => {
      this.style.height = `${ height * 100 }%`;
    }));


    /** OTHERS **/

    this.userBorderResize = createMulticastReplayLastSource<IUserBordersResize | null>({
      initialValue: DEFAULT_USER_BORDERS_RESIZE
    });

    this.isMaximised = reactiveFunction([
      this.left.subscribe,
      this.width.subscribe,
      this.top.subscribe,
      this.height.subscribe,
    ], (
      left: number,
      width: number,
      top: number,
      height: number,
    ) => {
      return (left === 0)
        && (width === 1)
        && (top === 0)
        && (height === 1);
    });

    // *if="$and($not(data.$isMaximized), data.$enableUserResize)"
    const maximizeButtonVisible = reactiveFunction([this.isMaximised], (isMaximized: boolean) => {
      return !isMaximized;
    });

    // *if="$and(data.$isMaximized, data.$enableUserResize)"
    const reduceButtonVisible = reactiveFunction([this.isMaximised], (isMaximized: boolean) => {
      return isMaximized;
    });

    /** DATA **/

    this.data = {
      /* bind */
      maximizeButtonVisible,
      reduceButtonVisible,

      /* events */
      onClickMenuButton: () => {
        console.log('menu');
      },
      onClickMinimizeButton: () => {
        console.log('minimize');
      },
      onClickMaximizeButton: () => {
        // TODO:  if (this.enableUserResize) {
        this.maximize();
      },
      onClickReduceButton: () => {
        // TODO:  if (this.enableUserResize) {
        this.reduce();
      },
      onClickCloseButton: () => {
        console.log('close');
      },
    };
  }

  /** HORIZONTAL **/

  /* LEFT */

  getLeft(): number {
    return this.left.getValue();
  }

  setLeftKeepingWidth(left: number): void {
    this.left.emit(left);
  }

  setLeftKeepingRight(left: number): void {
    const leftPlusWidth: number = this.getLeft() + this.getWidth();
    this.left.emit(Math.min(left, leftPlusWidth));
    this.width.emit(Math.max(0, leftPlusWidth - left));
  }

  subscribeLeft(emit: IObserver<number>): IUnsubscribe {
    return this.left.subscribe(emit);
  }

  /* WIDTH */

  getWidth(): number {
    return this.width.getValue();
  }

  setWidthKeepingLeft(width: number): void {
    this.width.emit(normalizeWidth(width));
  }

  setWidthKeepingRight(width: number): void {
    width = normalizeWidth(width);
    this.left.emit(this.getLeft() + this.getWidth() - width);
    this.width.emit(width);
  }

  subscribeWidth(emit: IObserver<number>): IUnsubscribe {
    return this.width.subscribe(emit);
  }

  /* RIGHT */

  getRight(): number {
    return (1 - this.getLeft() - this.getWidth());
  }

  setRightKeepingWidth(right: number): void {
    this.left.emit(1 - right - this.getWidth());
  }

  setRightKeepingLeft(right: number): void {
    this.width.emit(Math.max(0, 1 - this.getLeft() - right));
  }

  subscribeRight(emit: IObserver<number>): IUnsubscribe {
    return this.right(emit);
  }


  /** FEATURES **/

  getUserBorderResize(): IUserBordersResize | null {
    return this.userBorderResize.getValue();
  }

  setEnableUserResize(enable: boolean): void {
    this.classList.toggle('enable-user-resize', enable);
    this.subscriptions.get('resize', 'throw').toggle(enable);
  }

  enableUserMove(enable: boolean): void {
    this.classList.toggle('enable-user-move', enable);
    this.subscriptions.get('move', 'throw').toggle(enable);
  }

  maximize(): void {
    // TODO: better animation support
    this.runWithAnimations(() => {
      this.left.emit(0);
      this.width.emit(1);
      this.top.emit(0);
      this.height.emit(1);
    });
  }

  reduce(): void {
    this.runWithAnimations(() => {
      this.left.emit(0.2);
      this.width.emit(0.6);
      this.top.emit(0.2);
      this.height.emit(0.6);
    });
  }

  // TODO improve
  runWithAnimations(
    callback: () => void,
  ): Promise<void> {
    return new Promise<void>((
      resolve: (value: void | PromiseLike<void>) => void,
      reject: (reason?: any) => void,
    ): void => {
      this.classList.add('animations-enabled');
      callback();
      setTimeout(() => {
        this.classList.remove('animations-enabled');
      }, 150);
    });
  }

  /*----*/

  onCreate(): IWindowData {
    return this.data;
  }

  onInit(): void {
    this.subscriptions.set('resize', new Subscription<any>(
      createAllResizeObservableForAppWindowComponent(this),
      noop,
    ));

    this.subscriptions.set('move', new Subscription<any>(
      createMoveObservableForAppWindowComponent(this),
      noop,
    ));

    this.setEnableUserResize(true);
    this.enableUserMove(true);
  }

  onConnect(): void {
    this.subscriptions.activateAll();
  }

  onDisconnect(): void {
    this.subscriptions.deactivateAll();
  }
}


/**
 * INFO: move control to its container
 * OR subscribe to its position and update adjacent windows ?
 */


// @Component({
//   name: 'app-desktop-window',
//   // @ts-ignore
//   template: Template.fromRelativeURL(import.meta.url, './window.component.html', DESKTOP_TEMPLATE_BUILD_OPTIONS),
//   // @ts-ignore
//   style: Style.fromRelativeURL(import.meta.url, './window.component.css', DESKTOP_STYLE_BUILD_OPTIONS)
// })
// export class AppWindowComponent extends HTMLElement implements IComponent<IData>, OnCreate<IData>, OnInit, OnDestroy {
//
//   // @Input((value: IWindowTheme, instance: AppWindowComponent) => {
//   //   console.log('new theme', value);
//   // })
//   // theme: TInput<IWindowTheme>;
//
//   // @Input((value: boolean, instance: AppWindowComponent) => {
//   //   instance._allResizeActivable.toggle(value);
//   //   instance.refreshEnableUserResize();
//   //   instance.classList.toggle('enable-user-resize', value);
//   // })
//   // enableUserResize: TInput<boolean>;
//   //
//   // @Input((value: boolean, instance: AppWindowComponent) => {
//   //   instance._moveActivable.toggle(value);
//   //   instance.refreshEnableUserMove();
//   //   instance.classList.toggle('enable-user-move', value);
//   // })
//   // enableUserMove: TInput<boolean>;
//
//   // @Output()
//   // emitMaximize: TOutput<void>;
//
//   protected _top: number;
//   protected _bottom: number;
//   protected _left: number;
//   protected _right: number;
//   protected _enableUserResize: boolean;
//   protected _enableUserMove: boolean;
//
//   protected _data: IData;
//
//   protected _allResizeActivable: IActivable;
//   protected _moveActivable: IActivable;
//
//   constructor() {
//     super();
//     this._top = 0;
//     this._bottom = 0;
//     this._left = 0;
//     this._right = 0;
//     this._enableUserResize = false;
//     this._enableUserMove = false;
//
//     this._data = {
//       $isMaximized: new Source<boolean>().emit(this.isMaximized),
//       $enableUserResize: new Source<boolean>().emit(this.enableUserResize),
//       $enableUserMove: new Source<boolean>().emit(this.enableUserMove),
//       onClickMenuButton: new Observer<MouseEvent>(() => {
//         console.log('menu');
//       }).activate(),
//       onClickMinimizeButton: new Observer<MouseEvent>(() => {
//         console.log('minimize');
//       }).activate(),
//       onClickMaximizeButton: new Observer<MouseEvent>(() => {
//         if (this.enableUserResize) {
//           this.uniformResize(0);
//         }
//       }).activate(),
//       onClickReduceButton: new Observer<MouseEvent>(() => {
//         if (this.enableUserResize) {
//           this.uniformResize(0.2);
//         }
//       }).activate(),
//       onClickCloseButton: new Observer<MouseEvent>(() => {
//         console.log('close');
//       }).activate(),
//       // percent: new Source<string>()
//     };
//
//     const translateService = LoadService(TranslateService);
//
//     translateService.setTranslations('en', {
//       'window.header.button.menu': 'Menu',
//       'window.header.button.minimize': 'Minimize',
//       'window.header.button.maximize': 'Maximize',
//       'window.header.button.reduce': 'Reduce',
//       'window.header.button.close': 'Close',
//     });
//
//     translateService.setLocale('en');
//
//     (window as any).w = this;
//   }
//
//   get left(): number {
//     return this._left;
//   }
//
//   get right(): number {
//     return this._right;
//   }
//
//   get top(): number {
//     return this._top;
//   }
//
//   get bottom(): number {
//     return this._bottom;
//   }
//
//   get width(): number {
//     return 1 - this._left - this._right;
//   }
//
//   get height(): number {
//     return 1 - this._top - this._bottom;
//   }
//
//
//   get enableUserResize(): boolean {
//     return this._enableUserResize;
//   }
//
//   set enableUserResize(value: boolean) {
//     this._enableUserResize = value;
//     this._data.$enableUserResize.emit(value);
//     this.classList.toggle('enable-user-resize', value);
//     this._allResizeActivable.toggle(value);
//   }
//
//
//   get enableUserMove(): boolean {
//     return this._enableUserMove;
//   }
//
//   set enableUserMove(value: boolean) {
//     this._enableUserMove = value;
//     this._data.$enableUserMove.emit(value);
//     this.classList.toggle('enable-user-move', value);
//     this._moveActivable.toggle(value);
//   }
//
//
//   get container(): HTMLElement {
//     return ParentElementOrThrow(this);
//   }
//
//   get isMaximized(): boolean {
//     return (this._left === 0)
//       && (this._right === 0)
//       && (this._top === 0)
//       && (this._bottom === 0);
//   }
//
//
//   setLeft(value: number, force?: boolean) {
//     AppWindowComponentSetPosition(this, 'left', value, force);
//     this.refreshIsMaximized();
//   }
//
//   setRight(value: number, force?: boolean) {
//     AppWindowComponentSetPosition(this, 'right', value, force);
//     this.refreshIsMaximized();
//   }
//
//   setTop(value: number, force?: boolean) {
//     AppWindowComponentSetPosition(this, 'top', value, force);
//     this.refreshIsMaximized();
//   }
//
//   setBottom(value: number, force?: boolean) {
//     AppWindowComponentSetPosition(this, 'bottom', value, force);
//     this.refreshIsMaximized();
//   }
//
//
//   setWidthFromLeft(value: number): void {
//     this.setRight(1 - this._left - value, false);
//   }
//
//   setWidthFromRight(value: number): void {
//     this.setLeft(1 - this._right - value, false);
//   }
//
//   setHeightFromTop(value: number): void {
//     this.setBottom(1 - this._top - value, false);
//   }
//
//   setHeightFromBottom(value: number): void {
//     this.setTop(1 - this._bottom - value, false);
//   }
//
//
//   setLeftKeepingWidth(value: number): void {
//     const width: number = this.width;
//     this.setLeft(value, true);
//     this.setWidthFromLeft(width);
//   }
//
//   setRightKeepingWidth(value: number): void {
//     const width: number = this.width;
//     this.setRight(value, true);
//     this.setWidthFromRight(width);
//   }
//
//   setTopKeepingHeight(value: number): void {
//     const height: number = this.height;
//     this.setTop(value, true);
//     this.setHeightFromTop(height);
//   }
//
//   setBottomKeepingHeight(value: number): void {
//     const height: number = this.height;
//     this.setBottom(value, true);
//     this.setHeightFromBottom(height);
//   }
//
//
//   uniformResize(position: number = 0): void {
//     this.setLeft(position, true);
//     this.setTop(position, true);
//     this.setRight(position, false);
//     this.setBottom(position, false);
//   }
//
//   onCreate(context: IComponentContext<IData>): void {
//     context.data = this._data;
//   }
//
//   onInit(): void {
//     this._allResizeActivable = AppWindowComponentCreateAllResizeActivable(this);
//     this._moveActivable = AppWindowComponentCreateMoveActivable(this);
//
//     this.setLeft(0.1, true);
//     this.setTop(0.1, true);
//     this.setRight(0.1, false);
//     this.setBottom(0.1, false);
//     this.enableUserResize = true;
//     this.enableUserMove = true;
//   }
//
//   onDestroy(): void {
//
//   }
//
//   protected refreshIsMaximized(): void {
//     this._data.$isMaximized.emit(this.isMaximized);
//   }
// }
