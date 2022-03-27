import { interval, IObservable, map$$ } from '@lifaon/rx-js-light';
import {
  createDocumentFragment, createElement, createReactiveTextNode, createTextNode, getDocumentBody, isDOMNode,
  nodeAppendChild
} from '@lifaon/rx-dom';
// @ts-ignore
import classes from './debug-tsx.module.scss'

export type IComponentLike =
  | Node
  | string
  | IObservable<string>
// | readonly IComponentLike[]
  ;

export type IComponentProperties =
  | Record<string, any>
  | null
  ;

export interface IGetChildren {
  (): DocumentFragment;
}

export interface IFunctionComponent {
  (
    props: IComponentProperties,
    children: IGetChildren,
  ): Node;
}

const Fragment = Symbol('Fragment');

// const a = DEFAULT_CONSTANTS_TO_IMPORT;

function h(
  type: string | typeof Fragment | IFunctionComponent,
  props: IComponentProperties,
  ...children: IComponentLike[]
): Node {
  if (typeof type === 'function') {
    let _children: DocumentFragment;
    return type(props, (): DocumentFragment => {
      if (_children === void 0) {
        _children = createDocumentFragment();
        for (let i = 0, l = children.length; i < l; i++) {
          nodeAppendChild(_children, render(children[i]));
        }
      }
      return _children;
    });
  } else {
    const node: Node = (type === Fragment)
      ? createDocumentFragment()
      : createElement(type);
    for (let i = 0, l = children.length; i < l; i++) {
      nodeAppendChild(node, render(children[i]));
    }
    return node;
  }
}

function render(
  component: IComponentLike,
): Node {
  if (isDOMNode(component)) {
    return component;
  } else if (typeof component === 'string') {
    return createTextNode(component);
  } else if (typeof component === 'function') {
    return createReactiveTextNode(component);
  // } else if (Array.isArray(component)) {
  //   const node: Node = createDocumentFragment();
  //   for (let i = 0, l = component.length; i < l; i++) {
  //     nodeAppendChild(node, render(component[i]));
  //   }
  //   return node;
  } else {
    throw new Error(`Unsupported type`);
  }
}

// export function render(
//   vnode: ComponentChild,
//   parent: Element | Document | ShadowRoot | DocumentFragment,
//   replaceNode?: Element | Text
// ): void {
//
// }

// https://www.typescriptlang.org/tsconfig#jsxFactory
// https://reactjs.org/docs/jsx-in-depth.html

// async function debugTSX1() {
//   // const a = (<a href={5}></a>);
//
//   // const a = (
//   //   <div>
//   //     Here is a list:
//   //     <ul>
//   //       <li>Item 1</li>
//   //       <li>Item 2</li>
//   //     </ul>
//   //   </div>
//   // );
//
//   const a = (
//     <ul>
//       { 81 }
//       {
//         [0, 1, 2, 3].map((v: number) => {
//           return  <li>Item {v}</li>;
//         })
//       }
//     </ul>
//   );
//
//   console.log(a);
// }

async function debugTSX1() {
  const date$ = map$$(interval(500), () => new Date().toISOString());
  const list$ = map$$(interval(500), () => [0, 1, 2, 3]);

  function rxDOMFor<GItem>(
    subscribe: IObservable<Iterable<GItem>>,
    template: (item: GItem) => Node,
  ): Node {
    return template(null as any);
  }

  function rxDOMIf(
    subscribe: IObservable<boolean>,
    templateTrue: () => Node,
  ): Node {
    return templateTrue();
  }

  const Link = (
    props: IComponentProperties,
    children: IGetChildren,
  ) => {
    return <strong>{ children() }</strong>;
  };

  // const a = (<div>-{ date$ }-</div>);
  // const a = (
  //   <div>
  //     {
  //       rxDOMFor(list$, (item: number): Node => {
  //         return <div>-{ item }-</div>;
  //       })
  //     }
  //   </div>
  // );

  // const a = (
  //   <div>
  //     {
  //       rxDOMIf(date$, (): Node => {
  //         return <div></div>;
  //       })
  //     }
  //   </div>
  // );

  // const a = (<>{ date$ }</>);
  // const a = (<Link a={ 5 }>{ date$ }</Link>);
  // const a = (<div {...{a: 5 }}></div>);
  // const a = (<div {...{a: 5 }}></div>);

  const a = `<div>${date$}</div>`

  console.log(classes);
  console.log(a);
  nodeAppendChild(getDocumentBody(), render(a));
}

export async function debugTSX() {
  await debugTSX1();
}



