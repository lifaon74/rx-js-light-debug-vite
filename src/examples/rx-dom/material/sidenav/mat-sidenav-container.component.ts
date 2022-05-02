import { $log, function$$, IObservable, IObserver, single } from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component,
  createDocumentFragmentFilledWithNodes, HTMLElementWithInputs, IComponentInput, IComponentInputListToPropertyNameList,
  IReactiveContent, OnCreate, querySelectorOrThrow, setReactiveClass, setReactiveClassList, subscribeOnNodeConnectedTo,
} from '@lirx/dom';
// @ts-ignore
import html from './mat-sidenav-container.component.html?raw';
// @ts-ignore
import style from './mat-sidenav-container.component.scss?inline';
import { findDOMElement } from '../../../misc/find-dom-element';
import { getActiveElement } from '../helpers/is-element-focused';


/** FUNCTIONS **/

/**
 * TODO make available in lirx/dom ?
 */
export function dispatchCustomEvent<GData>(
  node: HTMLElement,
  type: string,
  detail: GData,
): void {
  node.dispatchEvent(new CustomEvent(type, { bubbles: false, detail }));
}

/**
 * TODO make available in lirx/dom ?
 */
export function getElementChildAsReactiveContentObservable(
  element: ParentNode,
  selector: string,
): IObservable<IReactiveContent> {
  return single(createDocumentFragmentFilledWithNodes([querySelectorOrThrow(element, selector)]));
  // return single(createDocumentFragmentFilledWithNodes(Array.from(querySelectorOrThrow(element, selector).childNodes)));
}


/** TYPES **/

// https://material.angular.io/components/sidenav/examples

export type IMatSidenavComponentMode =
  | 'over'
  | 'push'
  ;

export type IMatSidenavComponentPosition =
  | 'start'
  | 'end'
  ;

export type IMatSidenavComponentUserCloseEvent = CustomEvent<'backdrop' | 'escape'>;


/** COMPONENT **/

interface IData {
  readonly content$: IObservable<IReactiveContent>;
  readonly sidenav$: IObservable<IReactiveContent>;
  readonly hasBackdrop$: IObservable<boolean>;
  readonly onClickBackdrop: IObserver<MouseEvent>;
  readonly onClickDrag: IObserver<MouseEvent>;
  readonly onKeyDownSidenav: IObserver<KeyboardEvent>;
}

type IComponentInputs = [
  IComponentInput<'mode', IMatSidenavComponentMode>,
  IComponentInput<'position', IMatSidenavComponentPosition>,
  IComponentInput<'hasBackdrop', boolean>,
  IComponentInput<'enableUserClose', boolean>,
  IComponentInput<'opened', boolean>,
];

const COMPONENT_INPUTS: IComponentInputListToPropertyNameList<IComponentInputs> = [
  'mode',
  'position',
  'hasBackdrop',
  'enableUserClose',
  'opened',
];

@Component({
  name: 'mat-sidenav-container',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatSidenavContainerComponent extends HTMLElementWithInputs<IComponentInputs>(COMPONENT_INPUTS) implements OnCreate<IData> {
  constructor() {
    super();
    // this.state = 'closed';
    this.mode = 'over';
    // this.mode = 'push';
    this.position = 'start';
    // this.position = 'end';
    this.hasBackdrop = true;
    // this.hasBackdrop = false;
    this.enableUserClose = false;
    // this.enableUserClose = true;
    // this.opened = true;
    this.opened = false;
  }

  public onCreate(
    $content: DocumentFragment,
  ): IData {
    const content$ = getElementChildAsReactiveContentObservable($content, '[content]');
    const sidenav$ = getElementChildAsReactiveContentObservable($content, '[sidenav]');

    const mode$ = this.mode$;
    const position$ = this.position$;
    const hasBackdrop$ = this.hasBackdrop$;
    const opened$ = this.opened$;

    setReactiveClass(opened$, this, 'mat-opened');
    setReactiveClass(hasBackdrop$, this, 'mat-has-backdrop');

    const classList$ = function$$(
      [mode$, position$],
      (mode, position) => {
        return new Set([
          `mat-mode-${mode}`,
          `mat-position-${position}`,
        ]);
      },
    );
    setReactiveClassList(classList$, this);



    const onClickBackdrop = (): void => {
      dispatchCustomEvent(this, 'user-close', 'backdrop');

      if (this.enableUserClose) {
        this.opened = false;
      }
    };

    const onClickDrag = (): void => {
      this.opened = !this.opened;
    };

    const onKeyDownSidenav = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        dispatchCustomEvent(this, 'user-close', 'escape');

        if (this.enableUserClose) {
          this.opened = false;
          (getActiveElement() as HTMLElement)?.blur?.();
        }
      }
    };

    // TODO improve later
    subscribeOnNodeConnectedTo(this, opened$, (opened: boolean): void => {
      if (opened) {
        queueMicrotask(() => {
          querySelectorOrThrow<HTMLElement>(this, `:scope > .sidenav > .content`).focus();
        });
      }
    });

    return {
      content$,
      sidenav$,
      hasBackdrop$,

      onClickBackdrop,
      onClickDrag,
      onKeyDownSidenav,
    };
  }
}
