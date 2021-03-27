import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppProgressBarComponent } from '../progress-bar/progress-bar.component';
import { AppProgressRingComponent } from '../progress-ring/progress-ring.component';
import {
  conditionalSubscribePipe, createMulticastReplayLastSource, distinctSubscribePipe, fromEventTarget, interval,
  ISubscribeFunction, mapSubscribePipe, of, pipeSubscribeFunction, reactiveFunction, shareSubscribePipe
} from '@lifaon/rx-js-light';

export const APP_GUIDELINE_CUSTOM_ELEMENTS = [
  AppProgressBarComponent,
  AppProgressRingComponent
];


/** COMPONENT **/

interface IData {
  progress: ISubscribeFunction<number>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  of,
  createElement: generateCreateElementFunctionWithCustomElements(APP_GUIDELINE_CUSTOM_ELEMENTS)
};

/*
      progress="0.75"
      radius="60"
      stroke="20"

      [progress]="of(0.75)"
      [radius]="of(60)"
      [stroke]="of(20)"
 */

@Component({
  name: 'app-guideline',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <app-progress-bar
      [progress]="$.progress"
    ></app-progress-bar>
    <app-progress-ring
      [progress]="$.progress"
      radius="60"
      stroke="20"
    ></app-progress-ring>
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `),
})
class AppGuideLineComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    let _progress: number = 0;

    const progress = pipeSubscribeFunction(interval(100), [
      mapSubscribePipe(() => (_progress = (_progress + Math.random() * 0.01) % 1))
    ]);

    this.data = {
      progress,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}

/** BOOTSTRAP FUNCTION **/

export function guidelineExample() {
  // bootstrap(new AppGuideLineComponent());
}
