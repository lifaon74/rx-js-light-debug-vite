import { IRGBAColor } from '../rgba-color.type';
import { createRGBAColor } from '../create-rgba-color';

/** HEX **/

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors

export function parseCSSHexColor(
  input: string,
): IRGBAColor | null {
  const value: number | null = parseCSSHexColorAsNumber(input);
  return (value === null)
    ? null
    : createRGBAColor(
      ((value >> 24) & 0xff) / 0xff,
      ((value >> 16) & 0xff) / 0xff,
      ((value >> 8) & 0xff) / 0xff,
      ((value) & 0xff) / 0xff,
    );
}

export function parseCSSHexColorAsNumber(
  input: string,
): number | null {
  if (input.startsWith('#')) {
    const value: number = parseInt(input.slice(1), 16);
    if (Number.isSafeInteger(value)) {
      const length: number = input.length;
      if (length === 4) { // #RGB -> RRGGBBAA
        const r: number = (value & 0xf00) >> 8;
        const g: number = (value & 0x0f0) >> 4;
        const b: number = (value & 0x00f);
        return (
          (r << 28)
          | (r << 24)
          | (g << 20)
          | (g << 16)
          | (b << 12)
          | (b << 8)
          | 0xff
        ) >>> 0;
      } else if (length === 5) { // #RGBA -> RRGGBBAA
        const r: number = (value & 0xf000) >> 12;
        const g: number = (value & 0x0f00) >> 8;
        const b: number = (value & 0x00f0) >> 4;
        const a: number = (value & 0x000f);
        return (
          (r << 28)
          | (r << 24)
          | (g << 20)
          | (g << 16)
          | (b << 12)
          | (b << 8)
          | (a << 4)
          | (a)
        ) >>> 0;
      } else if (length === 7) { // #RRGGBB -> RRGGBBAA
        return (
          (value << 8)
          | 0xff
        ) >>> 0;
      } else if (length === 9) { // #RRGGBBAA -> RRGGBBAA
        return value >>> 0;
      }
    }
  }
  return null;
}
