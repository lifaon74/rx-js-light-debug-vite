import { MatColorInputComponent } from './mat-color-input.component';
import { bootstrap } from '@lifaon/rx-dom';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';


/** BOOTSTRAP FUNCTION **/

export function matColorInputExample() {
  /* MAT COLOR INPUT */

  const input = new MatColorInputComponent();
  bootstrap(input);

  /* INIT OVERLAY */

  MatOverlayManagerComponent.init();
}





// colorInput.value$ = shareRL$$(map$$(interval(1000), () => {
//   const rand = () => Math.floor(Math.random() * 255);
//   return `rgb(${ rand() }, ${ rand() }, ${ rand() })`;
// }));
//
// colorInput.readonly = true;
//
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
