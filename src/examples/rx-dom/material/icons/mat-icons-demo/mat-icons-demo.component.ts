import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component,
  createDocumentFragmentFilledWithNodes, ICustomElementConstructor, IReactiveContent, OnCreate,
} from '@lirx/dom';
import {
  debounceTime$$, fromPromiseFactory, IDefaultNotificationsUnion, IObservable, ISource, let$$, map$$, merge, single,
} from '@lirx/core';
import { IMatIconsListItem, MAT_ICONS_LIST } from '@lirx/mdi';
import { INPUT_VALUE_MODIFIER } from '../../form/modifiers/input-value.modifier';

// @ts-ignore
import html from './mat-icons-demo.component.html?raw';
// @ts-ignore
import style from './mat-icons-demo.component.scss?inline';
import { MatDualRingLoaderComponent } from '../../components/loaders/dual-ring-loader/mat-dual-ring-loader.component';
import { sleep } from '../../../../misc/sleep';


/** COMPONENT **/

interface IIcon {
  readonly componentTagName: string;
  readonly componentName: string;
  readonly content$: IObservable<IDefaultNotificationsUnion<IReactiveContent>>;
}

interface IData {
  readonly $inputValue$: ISource<string>;
  readonly icons$: IObservable<readonly IIcon[]>;
  readonly count$: IObservable<number>;
  readonly total$: IObservable<number>;
}

@Component({
  name: 'mat-icons-demo',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatDualRingLoaderComponent,
    ],
    modifiers: [
      INPUT_VALUE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatIconsDemoComponent extends HTMLElement implements OnCreate<IData> {
  public onCreate(): IData {
    const $inputValue$ = let$$<string>('');

    const { subscribe: inputValue$ } = $inputValue$;

    const inputValueDebounced$ = debounceTime$$(inputValue$, 500);

    const allIcons = MAT_ICONS_LIST.map(([fileName, componentTagName, componentName]: IMatIconsListItem): IIcon => {
      const content$ = fromPromiseFactory<IReactiveContent>(() => {
        return import('@lirx/mdi')
          // .finally(() => sleep(1000))
          .then(_ => createDocumentFragmentFilledWithNodes([new (_[componentName] as ICustomElementConstructor)]));
        // return import(`@lirx/mdi/src/icons/${fileName}`)
        //   .finally(() => sleep(1000))
        //   .then(_ => createDocumentFragmentFilledWithNodes([new (_ as ICustomElementConstructor)]));
      });

      return {
        componentTagName,
        componentName,
        content$,
      };
    });


    const icons$ = map$$(inputValueDebounced$, (inputValue: string): IIcon[] => {
      inputValue = inputValue.trim().toLowerCase();
      return allIcons
        .filter((icon: IIcon): boolean => {
          return icon.componentTagName.toLowerCase().includes(inputValue);
        })
        .slice(0, 100);
    });

    const count$ = merge([single(0), map$$(icons$, _ => _.length)]);
    const total$ = single(allIcons.length);

    return {
      $inputValue$,
      icons$,
      count$,
      total$,
    };
  }
}
