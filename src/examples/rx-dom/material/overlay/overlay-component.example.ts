import { bootstrap, createElement, getDocumentBody, nodeAppendChild, toReactiveContent } from '@lifaon/rx-dom';
import { fromEventTarget, of } from '@lifaon/rx-js-light';
import { MatAlertModalComponent } from './build-in/alert/mat-alert-modal.component';
import { MatOverlayManagerComponent } from './overlay/manager/mat-overlay-manager.component';
import { MatTooltipModalComponent } from './build-in/tooltip/mat-tooltip.component';
import { createTooltipModifier } from './build-in/tooltip/mat-tooltip.modifier';

const LOREM_IPSUM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Fusce vitae enim sit amet ante ornare ultricies',
  'Praesent fermentum lorem vitae lobortis hendrerit',
  'Proin sit amet sagittis lectus',
  'Vivamus ut tincidunt ipsum, sit amet facilisis libero',
  'Aliquam mattis finibus diam',
  'Sed nec efficitur libero, accumsan semper elit',
  'Phasellus sagittis est ac eros placerat blandit',
  'Nunc venenatis, sem vel maximus vulputate, est uribh, sit amet condimentum mauris turpis ut turpis',
  'Vestibulum mattis, ligula sit amet accumsan rhonc…cinia felis, et maximus dolor ligula aliquam elit',
  'Integer molestie faucibus nulla et egestas'
].join('.\n');




export function overlayComponentExampleAlert() {
  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);


  const openAlert = (message: string): MatAlertModalComponent => {
    return manager.open(MatAlertModalComponent, [{
      message: of(message),
    }]);
  };

  fromEventTarget(getDocumentBody(), 'click')((event: Event) => {
    if (event.currentTarget === event.target) {
      openAlert(LOREM_IPSUM);
    }
  });
}

export function overlayComponentExampleTooltip1() {
  const button = createElement('button');
  button.style.position = 'absolute';
  button.style.left = '50px';
  button.style.top = '50px';
  button.innerText = 'hello';
  nodeAppendChild(getDocumentBody(), button);

  /*---*/

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);

  const openTooltip = () => {
    return manager.open(MatTooltipModalComponent, [{ targetElement: button, content$: toReactiveContent(LOREM_IPSUM) }]);
  };

  /*---*/

  fromEventTarget(getDocumentBody(), 'click')((event: Event) => {
    if (event.currentTarget === event.target) {
      openTooltip();
    }
  });
}

export function overlayComponentExampleTooltip2() {

  const button = createElement('button');
  button.style.position = 'absolute';
  button.style.left = '50px';
  button.style.top = '50px';
  button.innerText = 'hello';
  nodeAppendChild(getDocumentBody(), button);

  /*---*/

  const manager = new MatOverlayManagerComponent();
  bootstrap(manager);

  /*---*/

  const TOOLTIP_MODIFIER = createTooltipModifier(manager);

  TOOLTIP_MODIFIER.modify(button, toReactiveContent(LOREM_IPSUM));
}


/*------------*/

export function overlayComponentExample() {
  // overlayComponentExampleAlert();
  // overlayComponentExampleTooltip1();
  overlayComponentExampleTooltip2();
}
