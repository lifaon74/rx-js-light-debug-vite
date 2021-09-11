import { MatOverlayComponent } from '../mat-overlay.component';

export interface IOpenOverlay<GArguments extends any[]> {
  (...args: GArguments): MatOverlayComponent;
}

export type IOpenCloseTuple<GArguments extends any[]> = [
  open: (...args: GArguments) => void,
  close: () => void,
  isOpen: () => boolean,
];

export function createOpenCloseTuple<GArguments extends any[]>(
  openOverlay: IOpenOverlay<GArguments>,
): IOpenCloseTuple<GArguments> {
  let overlay: MatOverlayComponent | undefined;

  const open = (...args: GArguments): void => {
    if (overlay === void 0) {
      overlay = openOverlay(...args);
    }
  };

  const close = (): void => {
    if (overlay !== void 0) {
      overlay.close();
      overlay = void 0;
    }
  };

  const isOpen = (): boolean => {
    return (overlay !== void 0);
  };

  return [
    open,
    close,
    isOpen,
  ];
}



/*--------------*/

export interface IMatOverlayOpenFunction<GArguments extends any[]> {
  (...args: GArguments): void;
}

export interface IMatOverlayCloseFunction  {
  (): void;
}

export interface IMatOverlayToggleFunction<GArguments extends any[]> {
  (args: GArguments, open?: boolean): void;
}

export interface IMatOverlayIsOpenFunction  {
  (): void;
}


export interface IMatOverlayController<GArguments extends any[]> {
  open: IMatOverlayOpenFunction<GArguments>;
  close: IMatOverlayCloseFunction;
  toggle: IMatOverlayToggleFunction<GArguments>;
  isOpen: IMatOverlayIsOpenFunction;
}


export function createMatOverlayController<GArguments extends any[]>(
  openOverlay: IOpenOverlay<GArguments>,
): IMatOverlayController<GArguments> {
  let overlay: MatOverlayComponent | undefined;

  const open = (...args: GArguments): void => {
    if (!isOpen()) {
      overlay = openOverlay(...args);
    }
  };

  const close = (): void => {
    if (isOpen()) {
      (overlay as MatOverlayComponent).close();
      overlay = void 0;
    }
  };

  const toggle = (
    args: GArguments,
    _open: boolean = !isOpen(),
  ): void => {
    if (_open) {
      open(...args);
    } else {
      close();
    }
  };

  const isOpen = (): boolean => {
    return (overlay !== void 0) && (!overlay.isClosed());
  };

  return {
    open,
    close,
    toggle,
    isOpen,
  };
}
