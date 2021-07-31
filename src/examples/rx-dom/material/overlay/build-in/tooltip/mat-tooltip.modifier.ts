import {
  createElementModifier, IHTMLElementModifierFunctionToNodeModifierFunction, INodeModifier, IReactiveContent,
  onNodeConnectedToWithImmediateCached, setAttributeValue, uuid
} from '@lifaon/rx-dom';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatTooltipModalComponent } from './mat-tooltip.component';
import { IUnsubscribeFunction } from '@lifaon/rx-js-light';
import { debounce$$$, distinct$$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';
import { mouseEnterSubscribeFunction } from '../../../helpers/mouse-enter-subscribe-function';



export interface IMatTooltipModifierFunction {
  (element: HTMLElement, content$: IReactiveContent): HTMLElement;
}

export function createMatTooltipModifierFunction(
  manager: MatOverlayManagerComponent,
): IMatTooltipModifierFunction {
  return (element: HTMLElement, content$: IReactiveContent): HTMLElement => {
    const ariaUUID: string = uuid();
    setAttributeValue(element, 'aria-describedby', ariaUUID);

    const display$ = pipe$$(mouseEnterSubscribeFunction(element), [
      debounce$$$<boolean>(100),
      distinct$$$<boolean>(),
    ]);

    let unsubscribe: IUnsubscribeFunction;
    let overlay: MatTooltipModalComponent | undefined;

    const close = () => {
      if (overlay !== void 0) {
        overlay.close();
        overlay = void 0;
      }
    };

    // TODO externalize as function
    onNodeConnectedToWithImmediateCached(element)((connected: boolean): void => {
      if (connected) {
        unsubscribe = display$((display: boolean): void => {
          if (display) {
            overlay = manager.open(MatTooltipModalComponent, [{ targetElement: element, content$ }]);
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

export type IMatTooltipModifier = INodeModifier<'tooltip', IHTMLElementModifierFunctionToNodeModifierFunction<IMatTooltipModifierFunction>>;

export function createMatTooltipModifier(
  manager: MatOverlayManagerComponent,
): IMatTooltipModifier {
  return createElementModifier('tooltip', createMatTooltipModifierFunction(manager));
}

