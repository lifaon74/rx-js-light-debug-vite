import { AppModalManagerComponent } from './manager/modal-manager.component';

export type IModalCloseOrigin = 'backdrop';

/**
 * Abstract component to build your modal from
 */
export abstract class AppModalComponent extends HTMLElement {
  public readonly manager: AppModalManagerComponent;

  protected constructor(
    manager: AppModalManagerComponent,
  ) {
    super();
    this.manager = manager;
  }

  close(origin?: IModalCloseOrigin): void {
    this.manager.close(this);
  }
}

