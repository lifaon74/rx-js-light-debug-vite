import { MatOverlayManagerComponent } from '../manager/mat-overlay-manager.component';

export type IOverlayCloseOrigin = 'backdrop' | 'escape';

/**
 * Abstract component to build your overlay from
 */
export abstract class MatOverlayComponent extends HTMLElement {
  public readonly manager: MatOverlayManagerComponent;
  // public readonly closed$: IObservable<boolean>;
  // protected readonly $closed: IObserver<boolean>;

  protected constructor(
    manager: MatOverlayManagerComponent,
  ) {
    super();
    this.manager = manager;
    // const $closed$ = let$$<boolean>(false);
    // this.closed$ = $closed$.subscribe;
    // this.$closed = $closed$.emit;
  }

  close(origin?: IOverlayCloseOrigin): void {
    this.manager.close(this);
    // this.$closed(true);
  }

  isClosed(): boolean {
    return this.manager.isClosed(this);
  }
}

