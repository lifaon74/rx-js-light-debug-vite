import { MatOverlayComponent } from '../mat-overlay.component';

export interface IOpenOverlay<GArguments extends any[]> {
  (...args: GArguments): MatOverlayComponent;
}

export type IOpenCloseTuple<GArguments extends any[]> = [
  open: (...args: GArguments) => void,
  close: () => void,
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

  return [
    open,
    close,
  ];
}
