import { parseCSSAbsoluteLengthOrThrow } from './parse-css-absolute-length';

export interface IElementPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function getElementPadding(
  node: Element,
): IElementPadding {
  const style: CSSStyleDeclaration = getComputedStyle(node);
  return {
    top: parseCSSAbsoluteLengthOrThrow(style.getPropertyValue('padding-top')),
    right: parseCSSAbsoluteLengthOrThrow(style.getPropertyValue('padding-right')),
    bottom: parseCSSAbsoluteLengthOrThrow(style.getPropertyValue('padding-bottom')),
    left: parseCSSAbsoluteLengthOrThrow(style.getPropertyValue('padding-left')),
  };
}
