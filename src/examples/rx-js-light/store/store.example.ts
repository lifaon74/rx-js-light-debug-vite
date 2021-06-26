import { createAction } from '../../store/action/create-action';
import { mapState } from '../../store/selector/map-state';
import { createStore } from '../../store/store/create-store';
import { selectState } from '../../store/selector/select-state';
import { createSelector } from '../../store/selector/create-selector';
import { immutableArrayReplace } from '../../store/helpers/immutable/array/immutable-array-replace';
import { immutableArrayRemove } from '../../store/helpers/immutable/array/immutable-array-remove';
import { getState } from '../../store/selector/get-state';
import { ImmutableArray } from '../../store/helpers/immutable/array/immutable-array.type';
import { Immutable } from '../../store/helpers/immutable/immutable.type';
import { immutableArrayPush } from '../../store/helpers/immutable/array/immutable-array-push';

// export class Store<GState> {
//   private readonly _store: IStore<GState>;
//   private readonly _actions: Map<string, IActionFunction<any>>;
//
//   constructor(
//     initialValue: GState,
//   ) {
//     this._store = createStore<GState>(initialValue);
//     this._actions = new Map<string, IActionFunction<any>>();
//   }
//
//   createAction<GArguments extends any[]>(
//     name: string,
//     updateState: IUpdateStateFunction<GState, GArguments>,
//   ): IActionFunction<GArguments> {
//     const action: IActionFunction<GArguments> = createAction(this._store, updateState);
//     this._actions.set(name, action);
//     return action;
//   }
//
//   select<GValue>(
//     mapFunction: IMapFunction<GState, GValue>,
//   ):  ISubscribeFunction<GValue> {
//     return mapState(this._store, mapFunction);
//   }
// }


/*------------*/

/* DEFINE STORE INTERFACES */

type IUser = Immutable<{
  name: string;
}>

type IAppState = Immutable<{
  users: ImmutableArray<IUser>;
}>;

/* INIT THE STORE */

const APP_STORE = createStore<IAppState>({
  users: [],
});

/* ACTIONS */

const appendUser = createAction(APP_STORE, (state: IAppState, user: IUser): IAppState => {
  return {
    ...state,
    users: immutableArrayPush(state.users, user),
    // EQUIVALENT
    // users: [...state.users, user],
  };
});

const removeUserByName = createAction(APP_STORE, (state: IAppState, name: string): IAppState => {
  const users: ImmutableArray<IUser> = state.users;
  const index: number = users.findIndex((user: IUser) => (user.name === name));
  if (index === -1) {
    return state;
  } else {
    return {
      ...state,
      users: immutableArrayRemove(users, index),
      // EQUIVALENT
      // users: [
      //   ...users.slice(0, index),
      //   ...users.slice(index + 1),
      // ],
    };
  }
});

export const renameUser = createAction(APP_STORE, (state: IAppState, user: IUser, name: string): IAppState => {
  const users: ImmutableArray<IUser> = state.users;
  const index: number = users.indexOf(user);
  if (index === -1) {
    throw new Error(`User not present in this list`);
  }

  return {
    ...state,
    users: immutableArrayReplace(users, index, {
      ...user,
      name
    }),
    // EQUIVALENT
    // users: [
    //   ...users.slice(0, index),
    //   {
    //     ...user,
    //     name
    //   },
    //   ...users.slice(index + 1),
    // ],
  };
});

/* SELECTORS */

const userCountSelector = createSelector((state: IAppState) => state.users.length);
const userCount$ = mapState(APP_STORE, userCountSelector);


const firstUserSelector = createSelector((state: IAppState) => state.users[0]);

const firstUserNameSelector = createSelector((state: IAppState) => firstUserSelector(state)?.name);
const firstUserName$ = mapState(APP_STORE, firstUserNameSelector);


/*------------*/


function storeExample1() {
  /* LISTENING */

  userCount$((count: number) => {
    console.log('user count:', count);
  });

  // firstUserName$((name: string) => {
  //   console.log('user name:', name);
  // });

  /* EXECUTE ACTIONS */

  appendUser({ name: 'Alice' });
  appendUser({ name: 'Bob' });
  removeUserByName('Bob');
  renameUser(selectState(APP_STORE, firstUserSelector), 'David');
}

/*
  INFO - size: 1139B
 */

/*--------------------*/


export function storeExample() {
  storeExample1();
}

