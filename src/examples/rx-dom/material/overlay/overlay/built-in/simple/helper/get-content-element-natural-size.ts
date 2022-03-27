import { ISize } from '../../../../../../../misc/types/size/size.type';
import {
  IGetExternalBoxForContainerElementWithMarginOptions,
} from './get-external-box-for-container-element-with-margin';
import {
  getElementStyleDeclaration, getStylePropertyObjectOrNull, IStylePropertyObjectOrNull, setStylePropertyObjectOrNull,
} from '@lifaon/rx-dom';


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

  const styleDeclaration = getElementStyleDeclaration(contentElement);

  const properties: INamedProperty[] = PROPERTY_NAMES.map((propertyName: string): INamedProperty => {
    return [
      propertyName,
      getStylePropertyObjectOrNull(styleDeclaration, propertyName),
    ];
  });

  const setProperty = (
    name: string,
    value: string,
  ): void => {
    contentElement.style.setProperty(name, value, 'important');
  };

  const scrollTop: number = contentElement.scrollTop;
  const scrollLeft: number = contentElement.scrollLeft;

  setProperty('width', 'auto');
  setProperty('height', 'auto');
  setProperty('left', 'auto');
  setProperty('top', 'auto');
  setProperty('margin', `${containerVerticalMargin}px ${containerHorizontalMargin}px`);

  const { width, height }: DOMRect = contentElement.getBoundingClientRect();

  properties.forEach(([propertyName, property]: INamedProperty): void => {
    setStylePropertyObjectOrNull(styleDeclaration, propertyName, property);
  });

  contentElement.scrollTop = scrollTop;
  contentElement.scrollLeft = scrollLeft;

  return {
    width,
    height,
  };
}
