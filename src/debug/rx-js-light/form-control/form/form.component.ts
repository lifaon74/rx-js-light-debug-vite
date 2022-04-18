import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lirx/dom';
import { of, single } from '@lirx/core';
// @ts-ignore
// import style from './number-input.component.scss';

/** COMPONENT **/

interface IData {

}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  single,
};

@Component({
  name: 'app-form',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <rx-inject-content
      content="single($content)"
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
