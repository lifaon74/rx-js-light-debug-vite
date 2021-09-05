import { IRGBAColor } from './colors/rgba/rgba-color.type';
import { IHSLAColor } from './colors/hsla/hsla-color.type';
import { IHSVAColor } from './colors/hsva/hsva-color.type';


export type IColor = IRGBAColor | IHSLAColor | IHSVAColor;
