import {
  compileReactiveHTMLAsComponentTemplate, Component, DEFAULT_ARITHMETIC_CONSTANTS_TO_IMPORT,
  DEFAULT_CONSTANTS_TO_IMPORT, HTMLElementConstructor, nodeAppendChild, OnCreate, DEFAULT_CASTING_CONSTANTS_TO_IMPORT, bootstrap
} from '@lifaon/rx-dom';
import {
  createSubscribeFunctionProxy, idle, ISubscribeFunctionProxy, mapSubscribePipe, pipeSubscribeFunction,
  shareSubscribePipe
} from '@lifaon/rx-js-light';
import { AppTilesListComponent } from './tiles-list/tiles-list.component';


/** BOOTSTRAP FUNCTION **/

export function infinitePostsExample() {
  bootstrap(new AppTilesListComponent());
}
