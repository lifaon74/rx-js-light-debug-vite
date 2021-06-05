import { dynamicDateExample } from './examples/rx-js-light/dynamic-date.example';
import { mousePositionExample } from './examples/rx-js-light/mouse-position.example';
import { debugObservableV5 } from './debug/debug-observables-v5';
import { debugI18N } from './debug/debug-observables-i18n';
import { debugReactiveDOM } from './debug/rx-dom/debug-reactive-dom';
import { modalComponentExample } from './examples/rx-dom/modal-example/modal-component.example';
import { autoUpdateExample } from './examples/rx-dom/auto-update/auto-update.example';
import { infinitePostsExample } from './examples/rx-dom/infinite-posts/infinite-posts.example';
import { intersectionObserverExample } from './examples/rx-js-light/intersection-observer.example';
import { matchMediaExample } from './examples/rx-js-light/match-media.example';
import { helloWorldExample } from './examples/rx-dom/hello-world/hello-world.example';
import { progressBarExample } from './examples/rx-dom/progress-bar/progress-bar.example';
import { progressBarLazyExample } from './examples/rx-dom/progress-bar/progress-bar.lazy.example';
import { trustedTypesExample } from './examples/trusted-types/trusted-types.example';
import { routerExample } from './examples/rx-dom/router/router.example';
import { progressRingExample } from './examples/rx-dom/progress-ring/progress-ring.example';
import { composeExample } from './examples/rx-js-light/compose.example';
import { progressRingLazyExample } from './examples/rx-dom/progress-ring/progress-ring.lazy.example';
import { guidelineExample } from './examples/rx-dom/guideline/guideline.example';
import { formControlDebug } from './debug/rx-js-light/form-control/form-control.debug';
import { commonPitfallExample } from './examples/rx-js-light/common-pitfall/common-pitfall.example';
import { fileTransferExample } from './examples/rx-dom/file-transfer/file-transfer.example';
import { pipeExample } from './examples/rx-js-light/pipe.example';
import { i18nExample } from './examples/rx-js-light/i18n/i18n.example';
import { rxjsLightShortcutsExample } from './examples/rx-js-light/shortcuts/rx-js-light-shortcuts.example';
import { forLoopExample } from './examples/rx-dom/for-loop/for-loop.example';
import { rxJSLightPerformancesExample } from './examples/rx-js-light/performances/performances.example';
import { helloWorldDebug } from './examples/rx-dom/hello-world/hello-world.debug';
import { lazyLoadExample } from './examples/rx-dom/lazy-load/lazy-load.example';
import { injectContentExample } from './examples/rx-dom/inject-content/inject-content.example';
import { sensorsExample } from './examples/rx-js-light/sensors/sensors.example';
import { audioPlayerExample } from './examples/rx-dom/audio-player/audio-player.example';
import { fileSystemExample } from './examples/rx-dom/file-system/file-system.example';
import { stateMachineDebug } from './debug/state-machine/state-machine.debug';

function run() {
  // debugObservableV5();
  // debugI18N();
  // debugReactiveDOM();
  // formControlDebug();
  // helloWorldDebug();
  // stateMachineDebug();

  // rxJSLightPerformancesExample();

  // console.log('started');
  // dynamicDateExample();
  // mousePositionExample();
  // modalComponentExample();
  // infinitePostsExample();
  // progressBarExample();
  // progressBarLazyExample();
  // progressRingExample();
  // progressRingLazyExample();
  // trustedTypesExample();
  // intersectionObserverExample();
  // matchMediaExample();
  // helloWorldExample();
  // forLoopExample();
  // routerExample();
  // guidelineExample();
  // composeExample();
  // pipeExample();
  // autoUpdateExample();
  // fileTransferExample();
  // commonPitfallExample();
  // i18nExample();
  // rxjsLightShortcutsExample();
  // lazyLoadExample();
  // injectContentExample();
  // sensorsExample();
  // audioPlayerExample();
  fileSystemExample();
}

run();





