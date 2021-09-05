import { IReadonlyRGBAColor, IRGBAColor } from '../rgba-color.type';
import { createRGBAColor } from '../create-rgba-color';


export function mixRGBAColors(
  colorA: IReadonlyRGBAColor,
  colorB: IReadonlyRGBAColor,
  proportion: number,
): IRGBAColor {
  if ((0 <= proportion) && (proportion <= 1)) {
    const _proportion: number = 1 - proportion;
    return createRGBAColor(
      ((colorA.r * _proportion) + (colorB.r * proportion)),
      ((colorA.b * _proportion) + (colorB.b * proportion)),
      ((colorA.b * _proportion) + (colorB.b * proportion)),
      ((colorA.a * _proportion) + (colorB.a * proportion)),
    );
  } else {
    throw new RangeError(`Expected 'proportion' in the range [0, 1]`);
  }
}
