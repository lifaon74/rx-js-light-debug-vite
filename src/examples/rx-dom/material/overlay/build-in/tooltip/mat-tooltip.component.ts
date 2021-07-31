import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, IDocumentFragmentOrNull, IReactiveContent, OnCreate, querySelector,
} from '@lifaon/rx-dom';
import { fromAnimationFrame, ISubscribeFunction } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-tooltip.component.scss';
// @ts-ignore
import html from './mat-tooltip.component.html?raw';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatSimpleOverlayComponent } from '../../overlay/built-in/simple/mat-simple-overlay.component';
import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { IPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size.type';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import {
  fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference, getElementExpectedSize,
} from '../../overlay/built-in/simple/helper/fit-box-relative-to-target-box';
import { positionAndSizeToCSSPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import { ICSSPositionAndSize } from '../../../../../misc/types/position-and-size/css-position-and-size.type';
import { getElementPositionAndSize } from '../../../../../misc/types/position-and-size/get-element-position-and-size';

/** COMPONENT **/

export interface IMatTooltipModalComponentOptions {
  targetElement: HTMLElement,
  content$: IReactiveContent;
  expectedBox?: IPartialSize,
  elementMargin?: number;
  containerHorizontalMargin?: number;
  containerVerticalMargin?: number;
}


interface IData {
  readonly content$: ISubscribeFunction<IDocumentFragmentOrNull>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'mat-tooltip-modal',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatTooltipModalComponent extends MatSimpleOverlayComponent implements OnCreate<IData> {
  protected readonly data: IData;

  constructor(
    manager: MatOverlayManagerComponent,
    {
      targetElement,
      content$,
      expectedBox,
      elementMargin = 5,
      containerHorizontalMargin = 5,
      containerVerticalMargin = 5,
    }: IMatTooltipModalComponentOptions,
  ) {

    const trigger$ = fromAnimationFrame();
    // const trigger$ = interval(1000);
    // const $trigger$ = let$$<void>();
    // (window as any).emit = $trigger$.emit;
    // const trigger$ = $trigger$.subscribe;

    const positionAndSize$: ISubscribeFunction<ICSSPositionAndSize> = map$$<void, ICSSPositionAndSize>(trigger$, () => {
      const contentElement: HTMLElement | null = querySelector(this, `:scope > .content`);
      if (contentElement === null) {
        return {
          left: '-1000px',
          top: '-1000px',
          width: '0',
          height: '0',
        };
      } else {
        const containerElementAndSize: IPositionAndSize = getElementPositionAndSize(this);
        const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);

        contentElement.style.setProperty('margin-right', `${ containerHorizontalMargin }px`);
        contentElement.style.setProperty('margin-bottom', `${ containerVerticalMargin }px`);
        const contentElementSize: ISize = getElementExpectedSize(contentElement, expectedBox);


        const _containerHorizontalMargin: number = Math.min(containerHorizontalMargin, containerElementAndSize.width / 2);
        const _containerVerticalMargin: number = Math.min(containerVerticalMargin, containerElementAndSize.height / 2);

        const externalBox: IPositionAndSize = {
          left: _containerHorizontalMargin,
          top: _containerVerticalMargin,
          width: containerElementAndSize.width - (_containerHorizontalMargin * 2),
          height: containerElementAndSize.height - (_containerVerticalMargin * 2),
        };

        const targetBox: IPositionAndSize = {
          left: targetElementPositionAndSize.left,
          top: targetElementPositionAndSize.top - elementMargin,
          width: targetElementPositionAndSize.width,
          height: targetElementPositionAndSize.height + (elementMargin * 2),
        };

        return positionAndSizeToCSSPositionAndSize(
          fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference(externalBox, targetBox, contentElementSize),
        );
      }
    });

    // const positionAndSize$ = single({
    //   left: '50px',
    //   top: '50px',
    //   width: 'auto',
    //   height: 'auto',
    // })

    // const positionAndSize$ = empty();

    super(manager, positionAndSize$, { backdropClosable: false });

    this.data = {
      content$,
    };
  }

  onCreate(): IData {
    return this.data;
  }
}

