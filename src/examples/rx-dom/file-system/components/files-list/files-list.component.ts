import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
  subscribeOnNodeConnectedTo,
} from '@lirx/dom';
// @ts-ignore
import html from './files-list.component.html?raw';
// @ts-ignore
import style from './files-list.component.scss';
import {
  fromPromise, IFromPromiseObservableNotifications, IObservable, let$$, map$$, mutateReadonlyReplayLastSourceArray,
  notificationObserver, SubscriptionManager,
} from '@lirx/core';
import { createInfiniteScrollObservable } from '../../../infinite-posts/helpers/infinite-scroll';

/** FUNCTIONS **/

async function * asyncIterableChunked<GItem>(
  iterator: AsyncIterator<GItem>,
  size: number,
): AsyncGenerator<readonly GItem[]> {
  let result: IteratorResult<GItem>;
  const chunk: GItem[] = new Array<GItem>(size);
  let i: number = 0;
  const sizeMinusOne: number = size - 1;
  while (!(result = await iterator.next()).done) {
    chunk[i] = result.value;
    if (i === sizeMinusOne) {
      yield chunk;
      i = 0;
    } else {
      i++;
    }
  }

  if (i !== 0) {
    chunk.length = i;
    yield chunk;
  }
}

async function * asyncIterableDynChunked<GItem>(
  iterator: AsyncIterator<GItem>,
  size: number,
): AsyncGenerator<GItem[], void, number> {
  loop: {
    const chunk: GItem[] = new Array<GItem>(size);
    for (let i = 0; i < size; i++) {
      const result: IteratorResult<GItem> = await iterator.next();
      if (result.done) {
        if (i !== 0) {
          chunk.length = i;
          yield chunk;
        }
      } else {
        chunk[i] = result.value;
        i++;
      }
    }
    size = yield chunk;
    break loop;
  }
}


/** INTERFACES **/

export interface IFileMetadata {
}

export interface IFile {
  id: string;
  previewURL: string;
  name: string;
  metadata: IFileMetadata;
}


type ILoadMoreFilesResult = IteratorResult<readonly IFile[]>;
type ILoadMoreFilesNotifications = IFromPromiseObservableNotifications<ILoadMoreFilesResult>;

type IFilesListState = 'awaiting' | 'loading' | 'done' | 'errored';

/** COMPONENT **/

interface IData {
  readonly files$: IObservable<readonly IFile[]>;
  readonly isLoading$: IObservable<boolean>;
  readonly isErrored$: IObservable<boolean>;
  readonly isNotErrored$: IObservable<boolean>;
  readonly state$: IObservable<IFilesListState>;
  readonly errorMessage$: IObservable<string>;
}

@Component({
  name: 'app-files-list',
  template: compileReactiveHTMLAsComponentTemplate(html),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppFilesListComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _subscriptions: SubscriptionManager;
  protected readonly _data: IData;

  constructor() {
    super();

    this._subscriptions = new SubscriptionManager();

    const getFiles = async function * (): AsyncGenerator<IFile> {
      let index: number = 0;
      while (true) {
        // while (index < 5) {
        // await sleep(200);

        yield {
          id: `#${index}`,
          // previewURL: '/assets/images/sample-01.jpg',
          previewURL: '',
          name: `#${index}`,
          metadata: {},
        };
        index++;

        // throw new Error(`Failed`);
      }
    };

    const filesIterator = getFiles();
    const paginatedFilesIterator = asyncIterableChunked(filesIterator, 10);


    const $files$ = let$$<readonly IFile[]>([]);
    const files$ = $files$.subscribe;

    const $state$ = let$$<IFilesListState>('awaiting');
    const state$ = $state$.subscribe;

    const isLoading$ = map$$(state$, (state: IFilesListState) => (state === 'loading'));
    const isErrored$ = map$$(state$, (state: IFilesListState) => (state === 'errored'));
    const isNotErrored$ = map$$(state$, (state: IFilesListState) => (state !== 'errored'));

    const $error$ = let$$<unknown>();
    const error$ = $error$.subscribe;
    const errorMessage$ = map$$(error$, (error: unknown): string => {
      return (error instanceof Error)
        ? error.message
        : '';
    });


    const awaitReachBottomStep = () => {
      $state$.emit('awaiting');

      const unsubscribeOfOnNodeConnectedTo = subscribeOnNodeConnectedTo(
        this,
        createInfiniteScrollObservable({ scrollElement: this, triggerDistance: 200 }),
        () => {
          unsubscribeOfOnNodeConnectedTo();
          loadMoreFilesStep();
        },
      );
    };

    const loadMoreFilesStep = () => {
      $state$.emit('loading');

      const unsubscribeOfOnNodeConnectedTo = subscribeOnNodeConnectedTo(
        this,
        fromPromise<ILoadMoreFilesResult>(paginatedFilesIterator.next()),
        notificationObserver<ILoadMoreFilesNotifications>({
          next: (result: ILoadMoreFilesResult) => {
            unsubscribeOfOnNodeConnectedTo();
            if (result.done) {
              doneStep();
            } else {
              mutateReadonlyReplayLastSourceArray($files$, (items: IFile[]) => {
                for (let i = 0, l = result.value.length; i < l; i++) {
                  items.push(result.value[i]);
                }
                // console.log(result.value, items);
              });
              awaitReachBottomStep();
            }
          },
          error: (error: unknown) => {
            unsubscribeOfOnNodeConnectedTo();
            errorStep(error);
          },
        }),
      );
    };

    const doneStep = () => {
      $state$.emit('done');
    };

    const errorStep = (error: unknown) => {
      $error$.emit(error);
      $state$.emit('errored');
      $files$.emit([]);
    };


    awaitReachBottomStep();

    this._data = {
      files$,
      isLoading$,
      isErrored$,
      isNotErrored$,
      state$,
      errorMessage$,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}

