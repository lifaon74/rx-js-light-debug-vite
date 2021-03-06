import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  OnCreate
} from '@lifaon/rx-dom';
import { IEmitFunction, ISubscribeFunction, of } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './alert-modal.component.scss';
// @ts-ignore
import html from './alert-modal.component.html?raw';
import { AppModalManagerComponent } from '../../modal/manager/modal-manager.component';
import { AppModalComponent } from '../../modal/modal.component';


interface IInputData {
  readonly message: string;
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
  name: 'app-modal-alert',
  template: compileReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppAlertModalComponent extends AppModalComponent implements OnCreate<IData> {
  protected readonly data: IData;

  constructor(
    manager: AppModalManagerComponent,
    data: IInputData,
  ) {
    super(manager);

    this.data = {
      message: of(data.message),
      closeButtonText: of('close'),
      onClickClose: () => {
        this.close();
      },
    };
  }

  onCreate(): IData {
    return this.data;
  }
}

