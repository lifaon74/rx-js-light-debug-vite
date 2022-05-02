import {
  createHTMLElementModifier, IHTMLElementModifier, IReactiveContentObservable, nodeRemove,
  onNodeConnectedToWithImmediateCached, setAttributeValue, uuid,
} from '@lirx/dom';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatTooltipComponent } from './mat-tooltip.component';
import { debounceTime$$$, distinct$$$, IUnsubscribe, pipe$$ } from '@lirx/core';
import { mouseEnterObservable } from '../../../helpers/mouse-enter-observable';


export interface IMatTooltipModifierFunction {
  (
    element: HTMLElement,
    content$: IReactiveContentObservable,
  ): HTMLElement;
}

export interface IGetMatOverlayManagerComponentReferenceFunction {
  (): MatOverlayManagerComponent;
}

export function createMatTooltipModifierFunction(
  managerRef: IGetMatOverlayManagerComponentReferenceFunction = () => MatOverlayManagerComponent.getInstance(),
): IMatTooltipModifierFunction {
  return (
    element: HTMLElement,
    content$: IReactiveContentObservable,
  ): HTMLElement => {
    const ariaUUID: string = uuid();
    setAttributeValue(element, 'aria-describedby', ariaUUID);

    const display$ = pipe$$(mouseEnterObservable(element), [
      debounceTime$$$<boolean>(500),
      distinct$$$<boolean>(),
    ]);

    let _unsubscribe: IUnsubscribe | undefined;
    let overlay: MatTooltipComponent | undefined;

    const close = () => {
      if (overlay !== void 0) {
        nodeRemove(overlay);
        overlay = void 0;
      }
    };

    const unsubscribe = () => {
      if (_unsubscribe !== void 0) {
        _unsubscribe();
        _unsubscribe = void 0;
      }
    };

    onNodeConnectedToWithImmediateCached(element)((connected: boolean): void => {
      if (connected) {
        _unsubscribe = display$((display: boolean): void => {
          if (display) {
            overlay = managerRef().open(new MatTooltipComponent({ targetElement: element, content$ }));
            overlay.id = ariaUUID;
            setAttributeValue(overlay, 'role', 'tooltip');
          } else {
            close();
          }
        });
      } else {
        unsubscribe();
        close();
      }
    });


    return element;
  };
}


/*-------------*/

export type IMatTooltipModifier = IHTMLElementModifier<'tooltip', IMatTooltipModifierFunction>;

export function createMatTooltipModifier(
  managerRef: IGetMatOverlayManagerComponentReferenceFunction,
): IMatTooltipModifier {
  return createHTMLElementModifier('tooltip', createMatTooltipModifierFunction(managerRef));
}

/*-------------*/

export const MAT_TOOLTIP_MODIFIER = createHTMLElementModifier('tooltip', createMatTooltipModifierFunction());

