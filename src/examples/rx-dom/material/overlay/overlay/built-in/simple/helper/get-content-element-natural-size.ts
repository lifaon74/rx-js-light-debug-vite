import { ISize } from '../../../../../../../misc/types/size/size.type';
import {
  IGetExternalBoxForContainerElementWithMarginOptions,
} from './get-external-box-for-container-element-with-margin';
import {
  getElementStyleDeclaration, getStylePropertyObjectOrNull, IStylePropertyObjectOrNull, setStyleProperty,
  setStylePropertyObjectOrNull,
} from '@lirx/dom';


const PROPERTY_NAMES: string[] = [
  'width',
  'height',
  'left',
  'right',
  'margin',
];

type INamedProperty = [
  name: string,
  property: IStylePropertyObjectOrNull,
];


export interface IGetElementNaturalSizeOptions extends //
  Pick<IGetExternalBoxForContainerElementWithMarginOptions, 'containerHorizontalMargin' | 'containerVerticalMargin'>
//
{
  contentElement: HTMLElement;
}

export function getContentElementNaturalSize(
  {
    contentElement,
    containerHorizontalMargin,
    containerVerticalMargin,
  }: IGetElementNaturalSizeOptions,
): ISize {
  const styleDeclaration: CSSStyleDeclaration = getElementStyleDeclaration(contentElement);

  // store current style properties
  const properties: INamedProperty[] = PROPERTY_NAMES.map((propertyName: string): INamedProperty => {
    return [
      propertyName,
      getStylePropertyObjectOrNull(styleDeclaration, propertyName),
    ];
  });

  // store current scroll state
  const scrollTop: number = contentElement.scrollTop;
  const scrollLeft: number = contentElement.scrollLeft;

  const _setStyleProperty = (
    name: string,
    value: string,
  ): void => {
    setStyleProperty(styleDeclaration, name, value, 'important');
  };

  // set style properties for a "natural" element
  _setStyleProperty('width', 'auto');
  _setStyleProperty('height', 'auto');
  _setStyleProperty('left', 'auto');
  _setStyleProperty('top', 'auto');
  _setStyleProperty('margin', `${containerVerticalMargin}px ${containerHorizontalMargin}px`);

  // compute natural element size
  const { width, height }: DOMRect = contentElement.getBoundingClientRect();

  // restore style properties
  properties.forEach(([propertyName, property]: INamedProperty): void => {
    setStylePropertyObjectOrNull(styleDeclaration, propertyName, property);
  });

  // restore scroll state
  contentElement.scrollTop = scrollTop;
  contentElement.scrollLeft = scrollLeft;

  return {
    width,
    height,
  };
}
