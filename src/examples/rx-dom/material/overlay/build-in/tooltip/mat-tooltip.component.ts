import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IDocumentFragmentOrNull,
  IReactiveContent, OnCreate, querySelector, subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
import { fromAnimationFrame, IObservable, map$$ } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-tooltip.component.scss';
// @ts-ignore
import html from './mat-tooltip.component.html?raw';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatSimpleOverlayComponent } from '../../overlay/built-in/simple/mat-simple-overlay.component';
import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { IPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size.type';
import {
  fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference,
} from '../../overlay/built-in/simple/helper/fit-box-relative-to-target-box';
import { positionAndSizeToCSSPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import { ICSSPositionAndSize } from '../../../../../misc/types/position-and-size/css-position-and-size.type';
import { getElementPositionAndSize } from '../../../../../misc/types/position-and-size/get-element-position-and-size';
import { getElementExpectedSize } from '../../overlay/built-in/simple/helper/get-element-expected-size';
import {
  getPositionAndSizeObservableForOverlayNearTargetElement, IContentElementSizeOptions,
} from '../../overlay/built-in/simple/helper/get-position-and-size-subscribe-function-for-simple-overlay';
import {
  MatSelectInputOverlayComponent
} from '../../../form/components/inputs/select/overlay/mat-select-overlay.component';
import { applyCSSPositionAndSize } from '../../../../../misc/types/position-and-size/apply-css-position-and-size';

/** COMPONENT **/

export interface IMatTooltipModalComponentOptions {
  targetElement: HTMLElement,
  content$: IReactiveContent;
}


interface IData {
  readonly content$: IObservable<IDocumentFragmentOrNull>;
}

@Component({
  name: 'mat-tooltip',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatTooltipComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor(
    {
      targetElement,
      content$,
    }: IMatTooltipModalComponentOptions,
  ) {
    super();

    const positionAndSize$: IObservable<ICSSPositionAndSize> = getPositionAndSizeObservableForMatTooltip(
      this,
      targetElement,
    );

    subscribeOnNodeConnectedTo(
      this,
      positionAndSize$,
      (positionAndSize: ICSSPositionAndSize) => {
        applyCSSPositionAndSize(this, positionAndSize);
      },
    );

    this.data = {
      content$,
    };
  }

  onCreate(): IData {
    return this.data;
  }
}


/** FUNCTION **/

// const containerHorizontalMargin = 5;
// const containerVerticalMargin = 5;

function getPositionAndSizeObservableForMatTooltip(
  contentElement: HTMLElement,
  targetElement: HTMLElement,
): IObservable<ICSSPositionAndSize> {
  return getPositionAndSizeObservableForOverlayNearTargetElement({
    contentElement,
    targetElement,
    getContentElementSize: (
      {
        contentElement,
      }: IContentElementSizeOptions,
    ) => {
      return getElementExpectedSize(contentElement);
    },
  });
}


// const trigger$ = fromAnimationFrame();
// // const trigger$ = interval(1000);
// // const $trigger$ = let$$<void>();
// // (window as any).emit = $trigger$.emit;
// // const trigger$ = $trigger$.subscribe;
//
// const positionAndSize$: IObservable<ICSSPositionAndSize> = map$$<void, ICSSPositionAndSize>(trigger$, () => {
//   const contentElement: HTMLElement | null = querySelector(this, `:scope > .content`);
//   if (contentElement === null) {
//     return {
//       left: '-1000px',
//       top: '-1000px',
//       width: '0',
//       height: '0',
//     };
//   } else {
//     const containerElementAndSize: IPositionAndSize = getElementPositionAndSize(this);
//     const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);
//
//     contentElement.style.setProperty('margin-right', `${ containerHorizontalMargin }px`);
//     contentElement.style.setProperty('margin-bottom', `${ containerVerticalMargin }px`);
//     const contentElementSize: ISize = getElementExpectedSize(contentElement, expectedBox);
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

