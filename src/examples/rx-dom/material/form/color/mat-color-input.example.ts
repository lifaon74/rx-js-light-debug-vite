import { MatColorInputComponent } from './mat-color-input.component';
import { bootstrap } from '@lifaon/rx-dom';
import { MatOverlayManagerComponent } from '../../overlay/overlay/manager/mat-overlay-manager.component';
import { parseCSSTime } from '../../../../misc/css/quantities/time/parse-css-time';
import { parseCSSRGBAColor } from '../../../../misc/css/color/colors/rgba/parse/parse-css-rgba-color';
import { parseCSSHexColor, parseCSSHexColorAsNumber } from '../../../../misc/css/color/colors/rgba/parse/parse-css-hex-color';
import { parseCSSRGBALikeColor } from '../../../../misc/css/color/colors/rgba/parse/parse-css-rgba-like-color';
import { parseCSSAngle } from '../../../../misc/css/quantities/angle/parse-css-angle';
import { parseCSSTurnsAsTurnsValueAndUnit } from '../../../../misc/css/quantities/angle/units/turns/parse-css-turns-as-turns-value-and-unit';
import { parseCSSHSLAColor, parseCSSHSLColor } from '../../../../misc/css/color/colors/hsla/parse/parse-css-hsla-color';

/** BOOTSTRAP FUNCTION **/

export function matColorInputExample() {


  /* INIT OVERLAY */

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);

  /* MAT COLOR */

  const colorInput = new MatColorInputComponent();
  bootstrap(colorInput);

  // console.log(parseCSSTime('15ms'));/*/
  // console.log(parseCSSRGBAColor('rgba(100%, 2, 3,0.1)'));
  // console.log(parseCSSRGBAColor('rgb(1, 2, 3)'));
  // console.log((parseCSSHexColorAsNumber('#f00') as number).toString(16));
  // console.log((parseCSSHexColorAsNumber('#f008') as number).toString(16));
  // console.log((parseCSSHexColorAsNumber('#12345678') as number).toString(16));
  // console.log((parseCSSHexColorAsNumber('#123456') as number).toString(16));
  // console.log(parseCSSRGBALikeColor('#f45'));
  // console.log(parseCSSAngle('45deg'));
  // console.log(parseCSSAngle('6.2832rad'));
  // console.log(parseCSSAngle('1.2turn'));
  // console.log(parseCSSHSLAColor('hsla(180, 100%, 50%, 0.1)'));
  // console.log(parseCSSHSLColor('hsl(180, 100%, 50%)'));
}
