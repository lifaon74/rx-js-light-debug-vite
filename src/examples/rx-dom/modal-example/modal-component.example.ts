import { bootstrap } from '@lifaon/rx-dom';
import { fromEventTarget, of } from '@lifaon/rx-js-light';
import { AppModalManagerComponent } from './modal/manager/modal-manager.component';
import { AppAlertModalComponent } from './build-in/alert/alert-modal.component';

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

export function modalComponentExample() {

  const manager = new AppModalManagerComponent();
  bootstrap(manager);

  const openAlert = (message: string): AppAlertModalComponent => {
    return manager.open(AppAlertModalComponent, {
      message: of(message),
    });
  };

  fromEventTarget(document.body, 'click')((event: Event) => {
    if (event.currentTarget === event.target) {
      openAlert(LOREM_IPSUM);
    }
  });
}
