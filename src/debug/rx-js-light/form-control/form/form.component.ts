import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import { of } from '@lifaon/rx-js-light';
// @ts-ignore
// import style from './number-input.component.scss';

/** COMPONENT **/

interface IData {

}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  of,
};

@Component({
  name: 'app-form',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <rx-inject-content
      content="of($content)"
    ></rx-inject-content>
  `, CONSTANTS_TO_IMPORT),
  // style: compileReactiveCSSAsComponentStyle(style),
})
export class AppFormComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();
    this._data = {};

    console.log(this.innerHTML);
  }

  onCreate(): IData {
    return this._data;
  }

}