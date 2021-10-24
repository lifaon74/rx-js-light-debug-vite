import { MatSelectComponent } from './mat-select.component';
import {
  bootstrap,
  compileAndEvaluateReactiveHTMLAsComponentTemplate, createDocumentFragment, DEFAULT_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, getDocumentBody, injectComponentTemplate
} from '@lifaon/rx-dom';
import { single } from '@lifaon/rx-js-light';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IMatSelectOption } from './types/mat-select-option.type';

/** BOOTSTRAP FUNCTION **/

export function matSelectExample() {


  /* INIT OVERLAY */

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);

  /* SELECT */

  const CONSTANTS_TO_IMPORT = {
    ...DEFAULT_CONSTANTS_TO_IMPORT,
    createElement: generateCreateElementFunctionWithCustomElements([
      MatSelectComponent,
    ]),
  };


  const options$ = single<IMatSelectOption<number>[]>(Array.from({ length: 10 }, (v: any, index: number): IMatSelectOption<number> => {
    return {
      label$: single(`options-${ index }`),
      value: index,
    };
  }));

  const template = compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <mat-select
      [options]="$.options$"
    ></mat-select>
  `, CONSTANTS_TO_IMPORT);

  injectComponentTemplate(template, getDocumentBody(), {
    options$,
  }, createDocumentFragment());
}
