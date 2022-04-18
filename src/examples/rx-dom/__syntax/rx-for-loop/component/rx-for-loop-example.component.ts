import { IObservable, IObserver, let$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, Component, IComponentTemplate, OnCreate } from '@lirx/dom';

/** DATA **/

interface IItem {
  readonly name: string;
}

interface IData {
  readonly $onSubmit: IObserver<Event>;
  readonly items$: IObservable<readonly IItem[]>;
  readonly $onClickItem: IObserver<IItem>;
}

/** TEMPLATE **/

const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
  html: `
    <div class="add-items">
      <form (submit)="$.$onSubmit">
        <input
          name="name"
          placeholder="Name"
          required
        />
        <button type="submit">
          Add
        </button>
      </form>
    </div>

    <div class="items-container" style="margin-top: 15px;">
      <div
        *for="let item of $.items$; index as i"
        (click)="() => $.$onClickItem(item)"
      >
        #{{ i }} : {{ item.name }}
      </div>
    </div>
  `,
});


// const template: IComponentTemplate<IData> = compileReactiveHTMLAsComponentTemplate({
//   html: `
//     <rx-template
//       name="forLoopTemplate"
//       let-item
//       let-index="i"
//     >
//       <div
//         (click)="() => $.$onClickItem(item)"
//       >
//         #{{ i }} : {{ item.name }}
//       </div>
//     </rx-template>
//
//     <rx-for-loop
//       items="$.items$"
//       template="forLoopTemplate"
//     ></rx-for-loop>
//   `,
// });

/** COMPONENT **/

@Component({
  name: 'app-rx-for-loop-example',
  template,
})
export class AppRxForLoopExampleComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    const { emit: $items, subscribe: items$, getValue: getItems } = let$$<readonly IItem[]>([
      {
        name: 'Alice',
      },
      {
        name: 'Bob',
      },
      {
        name: 'Charlie',
      },
    ]);

    const addItem = (item: IItem): void => {
      $items([
        ...getItems(),
        item,
      ]);
    };

    const removeItem = (item: IItem): void => {
      const items: readonly IItem[] = getItems();
      const index: number = items.indexOf(item);
      if (index >= 0) {
        $items([
          ...items.slice(0, index),
          ...items.slice(index + 1),
        ]);
      }
    };


    const $onSubmit = (event: Event): void => {
      event.preventDefault();

      const form = event.target as HTMLFormElement;
      const input = form.elements.namedItem('name') as HTMLInputElement;

      addItem({
        name: input.value,
      });

      input.value = '';
    };

    const $onClickItem = removeItem;

    this._data = {
      $onSubmit,
      items$,
      $onClickItem,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
