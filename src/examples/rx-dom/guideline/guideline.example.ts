import {
  bootstrap,
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lirx/dom';
import { MatProgressBarComponent } from '../material/components/progress/progress-bar/mat-progress-bar.component';
import { MatProgressRingComponent } from '../material/components/progress/progress-ring/mat-progress-ring.component';
import {
  conditionalObservablePipe, createMulticastReplayLastSource, distinctObservablePipe, fromEventTarget, interval,
  IObservable, mapObservablePipe, of, pipeObservable, reactiveFunction, shareObservablePipe
} from '@lirx/core';

export const APP_GUIDELINE_CUSTOM_ELEMENTS = [
  MatProgressBarComponent,
  MatProgressRingComponent
];


/** COMPONENT **/

interface IData {
  progress: IObservable<number>;
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
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `)],
})
class AppGuideLineComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    let _progress: number = 0;

    const progress = pipeObservable(interval(100), [
      mapObservablePipe(() => (_progress = (_progress + Math.random() * 0.01) % 1))
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
  bootstrap(new AppGuideLineComponent());
}
