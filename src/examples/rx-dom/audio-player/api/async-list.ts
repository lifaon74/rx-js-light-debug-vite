export type IItemIdSpecial = 'first' | 'last';

export type IItemId = string;

// export type IItemIdOrNull = IItemId | null;

// export type IOptionalItemId = IItemId | undefined;

export interface IVirtualLinkedListItem<GData> {
  id: IItemId;
  prev: IItemId | null;
  next: IItemId | null;
  data: GData;
}

export interface IVirtualLinkedLisGetItemFunction<GData> {
  (
    id: IItemId | IItemIdSpecial,
    signal?: AbortSignal,
  ): Promise<IVirtualLinkedListItem<GData> | null>;
}


/* FROM PAGINATION */

export interface IPageInfo {
  pageIndex: number;
  itemsPerPage: number;
}

export interface IPaginatedData<GData> extends IPageInfo {
  data: GData[];
  itemsCount: number;
}

export interface IVirtualLinkedListForPaginationFunction<GData> {
  (
    page: IPageInfo,
    signal?: AbortSignal,
  ): Promise<IPaginatedData<GData>>;
}


export function createVirtualLinkedLisGetItemFunctionFromPaginationFunction<GData>(
  callback: IVirtualLinkedListForPaginationFunction<GData>,
  itemsPerPage: number = 10,
): IVirtualLinkedLisGetItemFunction<GData> {

  let firstItemId: IItemId | null;
  let lastItemId: IItemId | null;

  const CACHED_ITEMS: Map<IItemId, IVirtualLinkedListItem<GData>> = new Map<IItemId, IVirtualLinkedListItem<GData>>();

  const getItemIdFromItemIndex = (
    index: number,
  ): IItemId => {
    return btoa(index.toString(16).padStart(17, '0'));
  };

  const getPageIndexFromItemIndex = (
    index: number,
  ): number => {
    return Math.floor(index / itemsPerPage);
  };

  const getPageIndexFromItemId = (
    id: IItemId,
  ): number => {
    return getPageIndexFromItemIndex(parseInt(atob(id), 16));
  };

  const storePaginatedData = (
    paginatedData: IPaginatedData<GData>,
  ): void => {
    const pageIndex: number = paginatedData.pageIndex;
    const itemsPerPage: number = paginatedData.itemsPerPage;
    const itemsCount: number = paginatedData.itemsCount;
    const dataList: GData[] = paginatedData.data;

    if (firstItemId === void 0) {
      firstItemId = (itemsCount === 0)
        ? null
        : getItemIdFromItemIndex(0);
    }

    if (lastItemId === void 0) {
      lastItemId = (itemsCount === 0)
        ? null
        : getItemIdFromItemIndex(itemsCount - 1);
    }

    let index: number = (pageIndex * itemsPerPage);

    for (let i = 0, l = dataList.length; i < l; i++, index++) {
      const data: GData = dataList[i];

      const id: IItemId = getItemIdFromItemIndex(index) as IItemId;

      const prev: IItemId | null = (index === 0)
        ? null
        : getItemIdFromItemIndex(index - 1);

      const next: IItemId | null = (index >= itemsCount)
        ? null
        : getItemIdFromItemIndex(index + 1);

      const item: IVirtualLinkedListItem<GData> = {
        id,
        prev,
        next,
        data,
      };

      CACHED_ITEMS.set(id, item);
    }
  };

  const fetchAndStorePaginatedData = (
    page: IPageInfo,
    signal?: AbortSignal,
  ): Promise<void> => {
    return callback(page, signal)
      .then(storePaginatedData);
  };

  const fetchAndStorePaginatedDataFromPageIndex = (
    pageIndex: number,
    signal?: AbortSignal,
  ): Promise<void> => {
    return fetchAndStorePaginatedData({
      pageIndex,
      itemsPerPage,
    }, signal);
  };

  const getCachedItem = (
    id: IItemId,
  ): IVirtualLinkedListItem<GData> => {
    return CACHED_ITEMS.get(id) as IVirtualLinkedListItem<GData>;
  };

  const getOptionallyNullCachedItem = (
    id: IItemId | null,
  ): IVirtualLinkedListItem<GData> | null => {
    return (id === null)
      ? null
      : getCachedItem(id);
  };

  return (
    id: IItemId | IItemIdSpecial,
    signal?: AbortSignal,
  ): Promise<IVirtualLinkedListItem<GData> | null> => {
    if (id === 'first') {
      if (firstItemId === void 0) {
        return fetchAndStorePaginatedDataFromPageIndex(0, signal)
          .then(() => getOptionallyNullCachedItem(firstItemId));
      } else {
        return Promise.resolve(getOptionallyNullCachedItem(firstItemId));
      }
    } else if (id === 'last') {
      if (lastItemId === void 0) {
        return callback({ pageIndex: 0, itemsPerPage: 1 }, signal)
          .then((paginatedData: IPaginatedData<GData>) => {
            return fetchAndStorePaginatedDataFromPageIndex(getPageIndexFromItemIndex(paginatedData.itemsCount - 1), signal)
              .then(() => getOptionallyNullCachedItem(lastItemId));
          });
      } else {
        return Promise.resolve(getOptionallyNullCachedItem(lastItemId));
      }
    } else if (CACHED_ITEMS.has(id)) {
      return Promise.resolve(getCachedItem(id));
    } else {
      return fetchAndStorePaginatedDataFromPageIndex(getPageIndexFromItemId(id), signal)
        .then(() => getOptionallyNullCachedItem(id));
    }
  };
}


/* TO ITERATOR */


export type IVirtualLinkedListIterator<GData> = AsyncIterator<IVirtualLinkedListItem<GData>>;

export async function * virtualLinkedListGetItemFunctionIterator<GData>(
  callback: IVirtualLinkedLisGetItemFunction<GData>,
  id: IItemId | IItemIdSpecial = 'first',
  signal?: AbortSignal,
): IVirtualLinkedListIterator<GData> {
  let item: IVirtualLinkedListItem<GData> | null;
  let _id: IItemId | IItemIdSpecial | null = id;
  do {
    item = await callback(_id, signal);
    if (item === null) {
      if (_id === id) {
        return;
      } else {
        throw new Error(`Failed to get item: '${ _id }'`);
      }
    }
    yield item;
    _id = item.next;
  } while (_id !== null);
}

export async function * virtualLinkedListGetItemFunctionReverseIterator<GData>(
  callback: IVirtualLinkedLisGetItemFunction<GData>,
  id: IItemId | IItemIdSpecial = 'last',
  signal?: AbortSignal,
): IVirtualLinkedListIterator<GData> {
  let item: IVirtualLinkedListItem<GData> | null;
  let _id: IItemId | IItemIdSpecial | null = id;
  do {
    item = await callback(_id, signal);
    if (item === null) {
      if (_id === id) {
        return;
      } else {
        throw new Error(`Failed to get item: '${ _id }'`);
      }
    }
    yield item;
    _id = item.prev;
  } while (_id !== null);
}

