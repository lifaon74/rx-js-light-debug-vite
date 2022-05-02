import { MatOverlayManagerComponent } from '../manager/mat-overlay-manager.component';
import { IObservable, IObserver, let$$ } from '@lirx/core';

export type IOverlayCloseOrigin =
  | 'backdrop'
  | 'escape'
  | 'program'
  ;

/**
 * Abstract component to build your overlay from
 */
export abstract class MatOverlayComponent extends HTMLElement {
  public readonly close$: IObservable<IOverlayCloseOrigin>;
  protected readonly $close: IObserver<IOverlayCloseOrigin>;

  protected constructor() {
    super();
    const $close$ = let$$<IOverlayCloseOrigin>();
    this.close$ = $close$.subscribe;
    this.$close = $close$.emit;
  }

  close(
    origin: IOverlayCloseOrigin = 'program',
  ): void {
    MatOverlayManagerComponent.close(this);
    this.$close(origin);
  }

  isClosed(): boolean {
    return MatOverlayManagerComponent.has(this);
  }
}

