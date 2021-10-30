import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate, querySelector,
} from '@lifaon/rx-dom';
import { fromAnimationFrame, IEmitFunction, ISubscribeFunction } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-select-overlay.component.scss';
// @ts-ignore
import html from './mat-select-overlay.component.html?raw';
import { ISize } from '../../../../../../../misc/types/size/size.type';
import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { positionAndSizeToCSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { getElementPositionAndSize } from '../../../../../../../misc/types/position-and-size/get-element-position-and-size';
import { MatSimpleOverlayComponent } from '../../../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IMatSelectInputOption, IMatSelectInputReadonlySelectedOptions } from '../types/mat-select-input-option.type';
import { POSITION_AND_SIZE_OUT_OF_WINDOW } from '../../../../../overlay/overlay/built-in/simple/helper/position-and-size-out-of-window.constant';
import { getFittingBoxForContainer$Target$ContentElements } from '../../../../../overlay/overlay/built-in/simple/helper/get-fitting-box-for-container-target-content-elements';
import { makeMatOverlayComponentBackdropClosable } from '../../../../../overlay/overlay/component/helpers/make-mat-overlay-component-backdrop-closable';
import { makeMatOverlayComponentClosableWithEscape } from '../../../../../overlay/overlay/component/helpers/make-mat-overlay-component-closable-with-escape';
import { IOverlayCloseOrigin } from '../../../../../overlay/overlay/component/mat-overlay.component';


/** COMPONENT **/

export interface IMatSelectOverlayComponentOnClickOption<GValue> {
  (option: IMatSelectInputOption<GValue>): void;
}

export interface IMatSelectOverlayComponentOptions<GValue> {
  readonly targetElement: HTMLElement;
  readonly $close: IEmitFunction<void>;
  readonly optionsSet$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>;
}


interface IData<GValue> {
  readonly optionsSet$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly $onPointerDownOption: IMatSelectOverlayComponentOnClickOption<GValue>;
}

@Component({
  name: 'mat-select-input-overlay',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatSelectInputOverlayComponent<GValue> extends MatSimpleOverlayComponent implements OnCreate<IData<GValue>> {
  protected readonly data: IData<GValue>;
  protected readonly $close: IEmitFunction<void>;

  constructor(
    manager: MatOverlayManagerComponent,
    {
      targetElement,
      $close,
      optionsSet$,
    }: IMatSelectOverlayComponentOptions<GValue>,
  ) {

    const positionAndSize$: ISubscribeFunction<ICSSPositionAndSize> = getPositionAndSizeSubscribeFunctionForMatSelectInputOverlay<GValue>(
      () => this,
      targetElement,
    );


    super(manager, positionAndSize$);

    makeMatOverlayComponentBackdropClosable(this);
    makeMatOverlayComponentClosableWithEscape(this);

    this.$close = $close;

    /** REFLECT COLOR ON ELEMENTS **/


    // const trigger$ = fromAnimationFrame();
    //
    // // TODO improve
    // const positionAndSize$: ISubscribeFunction<ICSSPositionAndSize> = map$$<void, ICSSPositionAndSize>(trigger$, () => {
    //   const contentElement: HTMLElement | null = querySelector(this, `:scope > .content`);
    //   if (contentElement === null) {
    //     return {
    //       left: '-1000px',
    //       top: '-1000px',
    //       width: '0',
    //       height: '0',
    //     };
    //   } else {
    //     const containerHorizontalMargin: number = 5;
    //     const containerVerticalMargin: number = 5;
    //     const elementMargin: number = 5;
    //
    //     const containerElementAndSize: IPositionAndSize = getElementPositionAndSize(this);
    //     const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);
    //
    //     contentElement.style.setProperty('margin-right', `${ containerHorizontalMargin }px`);
    //     contentElement.style.setProperty('margin-bottom', `${ containerVerticalMargin }px`);
    //
    //     const contentElementSize: ISize = getElementExpectedSize(
    //       contentElement,
    //       { width: targetElementPositionAndSize.width },
    //     );
    //
    //
    //     const _containerHorizontalMargin: number = Math.min(containerHorizontalMargin, containerElementAndSize.width / 2);
    //     const _containerVerticalMargin: number = Math.min(containerVerticalMargin, containerElementAndSize.height / 2);
    //
    //     const externalBox: IPositionAndSize = {
    //       left: _containerHorizontalMargin,
    //       top: _containerVerticalMargin,
    //       width: containerElementAndSize.width - (_containerHorizontalMargin * 2),
    //       height: containerElementAndSize.height - (_containerVerticalMargin * 2),
    //     };
    //
    //     const targetBox: IPositionAndSize = {
    //       left: targetElementPositionAndSize.left,
    //       top: targetElementPositionAndSize.top - elementMargin,
    //       width: targetElementPositionAndSize.width,
    //       height: targetElementPositionAndSize.height + (elementMargin * 2),
    //     };
    //
    //     return positionAndSizeToCSSPositionAndSize(
    //       fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference(externalBox, targetBox, contentElementSize),
    //     );
    //   }
    // });

    const $onPointerDownOption = (option: IMatSelectInputOption<GValue>) => {
      // option.$selected$.emit(!option.$selected$.getValue());
    };

    this.data = {
      optionsSet$,
      $onPointerDownOption,
    };
  }

  onCreate(): IData<GValue> {
    return this.data;
  }

  override close(origin?: IOverlayCloseOrigin): Promise<void> {
    this.$close();
    return super.close(origin);
  }
}


/** FUNCTIONS **/

const elementMargin: number = 5;
const containerHorizontalMargin: number = 5;
const containerVerticalMargin: number = 5;

export function getPositionAndSizeSubscribeFunctionForMatSelectInputOverlay<GValue>(
  getContainerElement: () => MatSelectInputOverlayComponent<GValue>,
  targetElement: HTMLElement,
): ISubscribeFunction<ICSSPositionAndSize> {
  return map$$<void, ICSSPositionAndSize>(fromAnimationFrame(), () => {
    const containerElement: HTMLElement = getContainerElement();
    const contentElement: HTMLElement | null = querySelector(containerElement, `:scope > .content`);

    if (contentElement === null) {
      return POSITION_AND_SIZE_OUT_OF_WINDOW;
    } else {
      const containerElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(containerElement);
      const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);

      const contentElementSize: ISize = {
        width: 250,
        height: 120,
      };

      return positionAndSizeToCSSPositionAndSize(
        getFittingBoxForContainer$Target$ContentElements({
          containerElementPositionAndSize,
          targetElementPositionAndSize,
          contentElementSize,
          // extra
          elementMargin,
          containerHorizontalMargin,
          containerVerticalMargin,
        }),
      );
    }
  });
}


