import {
  createElementModifier, IHTMLElementModifierFunctionToNodeModifierFunction, INodeModifier, IReactiveContent,
  onNodeConnectedToWithImmediateCached, setAttributeValue, uuid
} from '@lifaon/rx-dom';
import { MatOverlayManagerComponent } from '../../overlay/manager/mat-overlay-manager.component';
import { MatTooltipComponent } from './mat-tooltip.component';
import { debounceTime$$$, distinct$$$, IUnsubscribe, pipe$$ } from '@lifaon/rx-js-light';
import { mouseEnterObservable } from '../../../helpers/mouse-enter-subscribe-function';



export interface IMatTooltipModifierFunction {
  (element: HTMLElement, content$: IReactiveContent): HTMLElement;
}

export function createMatTooltipModifierFunction(
  managerRef: () => MatOverlayManagerComponent = () => MatOverlayManagerComponent.getInstance(),
): IMatTooltipModifierFunction {
  return (element: HTMLElement, content$: IReactiveContent): HTMLElement => {
    const ariaUUID: string = uuid();
    setAttributeValue(element, 'aria-describedby', ariaUUID);

    const display$ = pipe$$(mouseEnterObservable(element), [
      debounceTime$$$<boolean>(500),
      distinct$$$<boolean>(),
    ]);

    let _unsubscribe: IUnsubscribe;
    let overlay: MatTooltipComponent | undefined;

    const close = () => {
      if (overlay !== void 0) {
        overlay.close();
        overlay = void 0;
      }
    };

    const unsubscribe = () => {
      if (_unsubscribe !== void 0) {
        _unsubscribe();
        overlay = void 0;
      }
    };

    // TODO externalize as function
    onNodeConnectedToWithImmediateCached(element)((connected: boolean): void => {
      if (connected) {
        _unsubscribe = display$((display: boolean): void => {
          if (display) {
            overlay = managerRef().open_legacy(MatTooltipComponent, [{ targetElement: element, content$ }]);
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
  managerRef: () => MatOverlayManagerComponent,
): IMatTooltipModifier {
  return createElementModifier('tooltip', createMatTooltipModifierFunction(managerRef));
}

/*-------------*/

export const MAT_TOOLTIP_MODIFIER = createElementModifier('tooltip', createMatTooltipModifierFunction());

