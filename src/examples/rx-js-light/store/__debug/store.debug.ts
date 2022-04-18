import {
  createMulticastReplayLastSource, IMapFunction, IMulticastReplayLastSource, IObservable, let$$, map$$,
  mapObservablePipe
} from '@lirx/core';


function storeExample1() {
  /* DEFINE STORE INTERFACES */

  interface IUser {
    name: string;
  }

  interface IStore {
    users: IUser[];
  }

  /* INIT THE STORE */

  const APP_STORE = let$$<IStore>({
    users: [],
  });

  /* ACTIONS */

  function createAction<GValue, GArguments extends any[]>(
    store: IMulticastReplayLastSource<GValue>,
    updateState: (state: GValue, ...args: GArguments) => GValue,
  ): (...args: GArguments) => void {
    return (...args: GArguments): void => {
      store.emit(updateState(store.getValue(), ...args));
    };
  }

  const appendUser = createAction(APP_STORE, (state: IStore, user: IUser) => {
    return {
      ...state,
      users: [...state.users, user],
    };
  });

  // const appendUser2 = (user: IUser) => {
  //   APP_STORE.emit({
  //     ...APP_STORE.getValue(),
  //     users: [...APP_STORE.getValue().users, user],
  //   });
  // };

  const removeUserByName = (name: string) => {
    const users: IUser[] = APP_STORE.getValue().users;
    const index: number = users.findIndex((user: IUser) => (user.name === name));
    if (index !== -1) {
      APP_STORE.emit({
        ...APP_STORE.getValue(),
        users: [
          ...users.slice(0, index),
          ...users.slice(index + 1),
        ],
      });
    }
  };

  /* SELECTORS */

  const userCount$ = map$$(APP_STORE.subscribe, (store: IStore) => store.users.length);

  /* LISTENING */

  userCount$((count: number) => {
    console.log('user count:', count);
  });

  /* RUN ACTIONS */

  appendUser({ name: 'Alice' });
  appendUser({ name: 'Bob' });
  removeUserByName('Bob');
}

function storeExample11() {
  /* API */

  /* STORE */

  type IStore<GState> = IMulticastReplayLastSource<GState>;

  function createStore<GState>(
    initialState: GState,
  ): IStore<GState> {
    return createMulticastReplayLastSource<GState>(initialState);
  }

  /* ACTION */

  interface IUpdateStateFunction<GState, GArguments extends any[]> {
    (state: GState, ...args: GArguments): GState,
  }

  interface IAction<GArguments extends any[]> {
    (...args: GArguments): void,
  }


  function createAction<GState, GArguments extends any[]>(
    store: IStore<GState>,
    updateState: IUpdateStateFunction<GState, GArguments>,
  ): IAction<GArguments> {
    return (...args: GArguments): void => {
      store.emit(updateState(store.getValue(), ...args));
    };
  }


  /* SELECTOR */

  function mapState<GState, GValue>(
    store: IStore<GState>,
    mapFunction: IMapFunction<GState, GValue>,
  ): IObservable<GValue> {
    return mapObservablePipe(mapFunction)(store.subscribe);
  }

  /*--------------------------------------*/

  /* DEFINE STORE INTERFACES */

  interface IUser {
    name: string;
  }

  interface IAppState {
    users: IUser[];
  }

  /* INIT THE STORE */

  const APP_STORE = createStore<IAppState>({
    users: [],
  });

  /* ACTIONS */

  const appendUser = createAction(APP_STORE, (state: IAppState, user: IUser): IAppState => {
    return {
      ...state,
      users: [...state.users, user],
    };
  });

  const removeUserByName = createAction(APP_STORE, (state: IAppState, name: string): IAppState => {
    const users: IUser[] = state.users;
    const index: number = users.findIndex((user: IUser) => (user.name === name));
    if (index === -1) {
      return state;
    } else {
      return {
        ...state,
        users: [
          ...users.slice(0, index),
          ...users.slice(index + 1),
        ],
      };
    }
  });

  /* SELECTORS */

  const userCount$ = mapState(APP_STORE, (state: IAppState) => state.users.length);

  /* LISTENING */

  userCount$((count: number) => {
    console.log('user count:', count);
  });

  /* RUN ACTIONS */

  appendUser({ name: 'Alice' });
  appendUser({ name: 'Bob' });
  removeUserByName('Bob');
}


// function storeExample2() {
//   // https://ngrx.io/guide/store
//
//
//
//   // https://ngrx.io/guide/store/actions
//
//   interface IAction {
//     type: string;
//     (): any;
//   }
//
//   function createAction(
//     type: string,
//   ): IAction {
//     const action = () => {
//
//     };
//     action.type = type;
//     return action;
//   }
//
//   interface IReducer<GState, GAction extends IAction> {
//     (state: GState | undefined, action: GAction): GState;
//   }
//
//   function createReducer<GState>(
//     initialState: GState,
//   ): IReducer {
//
//   }
//
//   function on(): any {
//
//   }
//
//
//   function createStore<GStore>(
//     store: GStore,
//   ) {
//
//   }
//
//   /* ACTIONS */
//
//   const increment = createAction('[Counter Component] Increment');
//   const decrement = createAction('[Counter Component] Decrement');
//
//   /* REDUCER */
//
//   const initialState: number = 0;
//
//   const counterReducer = createReducer(
//     initialState,
//     on(increment, (state: number) => state + 1),
//     on(decrement, (state: number) => state - 1),
//     // on(reset, (state) => 0)
//   );
// }

function storeExample3() {
  // https://www.ngxs.io/concepts/store
}


function storeExample4() {
  interface IActionBuilder<GType extends string, GProperties extends object> {
    (properties: GProperties): IAction<GType, GProperties>;
  }

  type IAction<GType extends string, GProperties extends object> = {
    type: GType;
  } & GProperties;


  function createAction<GType extends string, GProperties extends object>(
    type: GType,
  ): IActionBuilder<GType, GProperties> {
    return (properties: GProperties): IAction<GType, GProperties> => {
      return {
        type,
        ...properties,
      };
    };
  }


  /*----------------*/

  interface IUser {
    name: string;
  }

  /*----------------*/

  const appendUser = createAction<`[User] add`, IUser>(`[User] add`);


}


function storeExample5() {
  interface IAction {
    readonly type: symbol;
  }

  type IActionWithProperties<GProperties extends object> = IAction & GProperties;

  interface IActionBuilder {
    (): IAction;
  }

  interface IActionBuilderWithProperties<GProperties extends object> {
    (action: GProperties): IActionWithProperties<GProperties>;
  }


  function createAction(
    name?: string,
  ): IActionBuilder;
  function createAction<GProperties extends object>(
    name?: string,
  ): IActionBuilderWithProperties<GProperties>;
  function createAction<GProperties extends object>(
    name?: string,
  ): IActionBuilder | IActionBuilderWithProperties<GProperties> {
    const type: symbol = Symbol(name);
    return (properties?: GProperties): IAction | IActionWithProperties<GProperties> => {
      return {
        type,
        ...properties,
      };
    };
  }


  /*--*/

  interface IReducer<GState, GAction extends IAction> {
    (state: GState | undefined, action: GAction): GState;
  }

  type IActionReduceTuple<GState, GAction extends IAction> = [
    action: GAction,
    reducer: IReducer<GState, GAction>,
  ];

  function on<GState, GAction extends IAction>(
    action: GAction,
    reducer: IReducer<GState, GAction>
  ): IActionReduceTuple<GState, GAction> {
    return [
      action,
      reducer,
    ];
  }

  function createState<GState>(
    initialValue: GState,
    actions: Iterable<IActionReduceTuple<GState, any>>
  ): void {

  }


  /*----------------*/

  interface IUser {
    name: string;
  }

  interface IAppState {
    users: IUser[];
  }

  /*----------------*/

  const appendUser = createAction<IUser>(`[User] append`);

}

/*--------------------*/


export function storeDebug() {
  // storeExample1();
  storeExample11();
  // storeExample2();
  // storeExample3();
  // storeExample4();
  // storeExample5();
}

