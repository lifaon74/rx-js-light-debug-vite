import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, IDocumentFragmentOrNull,
  IReactiveContentObservable, OnCreate,
  subscribeOnNodeConnectedTo,
} from '@lirx/dom';
import { IObservable } from '@lirx/core';
import { ICSSPositionAndSize } from '../../../../../misc/types/position-and-size/css-position-and-size.type';
import { applyCSSPositionAndSize } from '../../../../../misc/types/position-and-size/apply-css-position-and-size';
import { getContentElementNaturalSize } from '../../overlay/built-in/simple/helper/get-content-element-natural-size';
import {
  getPositionAndSizeObservableForOverlayNearTargetElement, IContentElementSizeOptions,
} from '../../overlay/built-in/simple/helper/get-position-and-size-observable-for-overlay-near-target-element';
// @ts-ignore
import style from './mat-tooltip.component.scss?inline';
// @ts-ignore
import html from './mat-tooltip.component.html?raw';

/** COMPONENT **/

export interface IMatTooltipModalComponentOptions {
  targetElement: HTMLElement,
  content$: IReactiveContentObservable;
}


interface IData {
  readonly content$: IObservable<IDocumentFragmentOrNull>;
}

@Component({
  name: 'mat-tooltip',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
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
      (positionAndSize: ICSSPositionAndSize): void => {
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

const containerHorizontalMargin = 5;
const containerVerticalMargin = 5;

function getPositionAndSizeObservableForMatTooltip(
  contentElement: HTMLElement,
  targetElement: HTMLElement,
): IObservable<ICSSPositionAndSize> {
  return getPositionAndSizeObservableForOverlayNearTargetElement({
    contentElement,
    targetElement,
    containerHorizontalMargin,
    containerVerticalMargin,
    getContentElementSize: (
      {
        contentElement,
      }: IContentElementSizeOptions,
    ) => {
      return getContentElementNaturalSize({
        contentElement,
        containerHorizontalMargin,
        containerVerticalMargin,
      });
    },
  });
}
