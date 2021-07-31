import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate, querySelector, trackById,
} from '@lifaon/rx-dom';
import { fromAnimationFrame, ISubscribeFunction } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-select-overlay.component.scss';
// @ts-ignore
import html from './mat-select-overlay.component.html?raw';
import { ISize } from '../../../../../misc/types/size/size.type';
import { IPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size.type';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { positionAndSizeToCSSPositionAndSize } from '../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import { ICSSPositionAndSize } from '../../../../../misc/types/position-and-size/css-position-and-size.type';
import { getElementPositionAndSize } from '../../../../../misc/types/position-and-size/get-element-position-and-size';
import { MatSimpleOverlayComponent } from '../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../overlay/overlay/manager/mat-overlay-manager.component';
import {
  fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference, getElementExpectedSize
} from '../../../overlay/overlay/built-in/simple/helper/fit-box-relative-to-target-box';
import { INormalizedMatSelectOption } from '../types/mat-select-option.type';


/** COMPONENT **/

export interface IMatSelectOverlayComponentOnClickOption<GValue> {
  (option: INormalizedMatSelectOption<GValue>): void;
}

export interface IMatSelectOverlayComponentOptions<GValue> {
  readonly targetElement: HTMLElement;
  readonly options$: ISubscribeFunction<INormalizedMatSelectOption<GValue>[]>;
}


interface IData<GValue> {
  readonly options$: ISubscribeFunction<INormalizedMatSelectOption<GValue>[]>;
  readonly onClickOption: IMatSelectOverlayComponentOnClickOption<GValue>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  trackById,
};

@Component({
  name: 'mat-select-overlay',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatSelectOverlayComponent<GValue> extends MatSimpleOverlayComponent implements OnCreate<IData<GValue>> {
  protected readonly data: IData<GValue>;

  constructor(
    manager: MatOverlayManagerComponent,
    {
      targetElement,
      options$,
    }: IMatSelectOverlayComponentOptions<GValue>,
  ) {

    const trigger$ = fromAnimationFrame();

    // TODO improve
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
        const containerHorizontalMargin: number = 5;
        const containerVerticalMargin: number = 5;
        const elementMargin: number = 5;

        const containerElementAndSize: IPositionAndSize = getElementPositionAndSize(this);
        const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);

        contentElement.style.setProperty('margin-right', `${ containerHorizontalMargin }px`);
        contentElement.style.setProperty('margin-bottom', `${ containerVerticalMargin }px`);

        const contentElementSize: ISize = getElementExpectedSize(
          contentElement,
          { width: targetElementPositionAndSize.width },
        );


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

    super(manager, positionAndSize$);

    const onClickOption = (option: INormalizedMatSelectOption<GValue>) => {
      option.$selected$.emit(!option.$selected$.getValue());
    };

    this.data = {
      options$,
      onClickOption,
    };
  }

  onCreate(): IData<GValue> {
    return this.data;
  }
}

