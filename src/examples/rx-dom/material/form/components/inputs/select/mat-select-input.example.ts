import { MatSelectInputComponent } from './mat-select-input.component';
import { bootstrap } from '@lifaon/rx-dom';
import { single } from '@lifaon/rx-js-light';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IMatSelectInputOption } from './types/mat-select-input-option.type';

/** BOOTSTRAP FUNCTION **/

export function matSelectInputExample() {
  /* MAT SELECT INPUT */

  const input = new MatSelectInputComponent();
  bootstrap(input);

  // const CONSTANTS_TO_IMPORT = {
  //   ...DEFAULT_CONSTANTS_TO_IMPORT,
  //   createElement: generateCreateElementFunctionWithCustomElements([
  //     MatSelectInputComponent,
  //   ]),
  // };
  //
  //
  // const options$ = single<IMatSelectOption<number>[]>(Array.from({ length: 10 }, (v: any, index: number): IMatSelectOption<number> => {
  //   return {
  //     label$: single(`options-${ index }`),
  //     value: index,
  //   };
  // }));
  //
  // const template = compileAndEvaluateReactiveHTMLAsComponentTemplate(`
  //   <mat-select
  //     [options]="$.options$"
  //   ></mat-select>
  // `, CONSTANTS_TO_IMPORT);
  //
  // injectComponentTemplate(template, getDocumentBody(), {
  //   options$,
  // }, createDocumentFragment());


  /* INIT OVERLAY */

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);


  /* PROPERTIES */

  const options = Array.from({ length: 10 }, (v: any, index: number): IMatSelectInputOption<number> => {
    return {
      label$: single(`options-${ index }`),
      value: index,
    };
  });

  input.rawOptions = options;

  // input.multiple = true;
  input.rawSelectedOptions = [options[0], options[1]];
}
