import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate
} from '@lifaon/rx-dom';
import { IObserver, IObservable, single } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-alert-modal.component.scss';
// @ts-ignore
import html from './mat-alert-modal.component.html?raw';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatModalComponent } from '../../overlay/built-in/modal/mat-modal.component';

/** COMPONENT **/

export interface IMatAlertModalComponentOptions {
  readonly message: IObservable<string>;
}

interface IData {
  readonly message: IObservable<string>;
  readonly closeButtonText: IObservable<string>;
  readonly onClickClose: IObserver<MouseEvent>;

}

@Component({
  name: 'mat-alert-modal',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
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

