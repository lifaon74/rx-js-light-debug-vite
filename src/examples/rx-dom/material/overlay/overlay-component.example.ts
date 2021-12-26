import { createElement, getDocumentBody, nodeAppendChild, toReactiveContent } from '@lifaon/rx-dom';
import { fromEventTarget } from '@lifaon/rx-js-light';
import { MatOverlayManagerComponent } from './overlay/manager/mat-overlay-manager.component';
import { MatTooltipComponent } from './build-in/tooltip/mat-tooltip.component';

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
  'Integer molestie faucibus nulla et egestas',
].join('.\n');


export function overlayComponentExample1() {
  MatOverlayManagerComponent.init();

  const open = (message: string): HTMLElement => {
    const element = createElement('div');
    element.innerText = message;
    return MatOverlayManagerComponent.open(element);
  };

  fromEventTarget(getDocumentBody(), 'click')((event: Event) => {
    if (event.currentTarget === event.target) {
      const overlay = open(LOREM_IPSUM);

      setTimeout(() => {
        MatOverlayManagerComponent.close(overlay);
      }, 1000);
    }
  });
}


// export function overlayComponentExampleAlert() {
//   const manager = new MatOverlayManagerComponent();
//   bootstrap(manager);
//
//
//   const openAlert = (message: string): MatAlertModalComponent => {
//     return manager.open_legacy(MatAlertModalComponent, [{
//       message: of(message),
//     }]);
//   };
//
//   fromEventTarget(getDocumentBody(), 'click')((event: Event) => {
//     if (event.currentTarget === event.target) {
//       openAlert(LOREM_IPSUM);
//     }
//   });
// }
//
export function overlayComponentExampleTooltip1() {
  const button = createElement('button');
  button.style.position = 'absolute';
  button.style.left = '50px';
  button.style.top = '50px';
  button.innerText = 'hello';
  nodeAppendChild(getDocumentBody(), button);

  /*---*/

  MatOverlayManagerComponent.init();

  const openTooltip = () => {
    return MatOverlayManagerComponent.open(new MatTooltipComponent({
      targetElement: button,
      content$: toReactiveContent(LOREM_IPSUM),
    }));
  };

  /*---*/

  fromEventTarget(getDocumentBody(), 'click')((event: Event) => {
    if (event.currentTarget === event.target) {
      const overlay = openTooltip();
      // setTimeout(() => {
      //   MatOverlayManagerComponent.close(overlay);
      // }, 1000);
    }
  });
}

// export function overlayComponentExampleTooltip2() {
//
//   const button = createElement('button');
//   button.style.position = 'absolute';
//   button.style.left = '50px';
//   button.style.top = '50px';
//   button.innerText = 'hello';
//   nodeAppendChild(getDocumentBody(), button);
//
//   /*---*/
//
//   const manager = new MatOverlayManagerComponent();
//   bootstrap(manager);
//
//   /*---*/
//
//   MAT_TOOLTIP_MODIFIER.modify(button, toReactiveContent(LOREM_IPSUM));
// }
//

/*------------*/

export function overlayComponentExample() {
  // overlayComponentExample1();
  // overlayComponentExampleAlert();
  overlayComponentExampleTooltip1();
  // overlayComponentExampleTooltip2();
}
