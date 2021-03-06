import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import { IEmitFunction, ISubscribeFunction, single } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-alert-modal.component.scss';
// @ts-ignore
import html from './mat-alert-modal.component.html?raw';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatModalComponent } from '../../overlay/built-in/modal/mat-modal.component';

/** COMPONENT **/

export interface IMatAlertModalComponentOptions {
  readonly message: ISubscribeFunction<string>;
}

interface IData {
  readonly message: ISubscribeFunction<string>;
  readonly closeButtonText: ISubscribeFunction<string>;
  readonly onClickClose: IEmitFunction<MouseEvent>;

}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'mat-alert-modal',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatAlertModalComponent extends MatModalComponent implements OnCreate<IData> {
  protected readonly data: IData;

  constructor(
    manager: MatOverlayManagerComponent,
    options: IMatAlertModalComponentOptions,
  ) {
    super(manager);

    this.data = {
      message: options.message,
      closeButtonText: single('close'),
      onClickClose: () => {
        this.close();
      },
    };
  }

  onCreate(): IData {
    return this.data;
  }
}

