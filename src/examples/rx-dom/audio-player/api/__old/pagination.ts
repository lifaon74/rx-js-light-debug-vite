// export type TPageIndex = number; // starts from 0
//
// /* PAGINATION */
//
// /**
//  * What to provide to get a page
//  */
// export interface IPageInfo {
//   pageIndex: TPageIndex;
//   itemsPerPage: number;
// }
//
// export type IPartialPageInfo = Partial<IPageInfo>;
//
// /**
//  * What is returned by a pagination
//  */
// export interface IPaginatedData<GData> extends IPageInfo {
//   data: GData[];
//   itemsCount: number;
// }
//
//
// /**
//  * Returns the number of pages for a paginated result
//  */
// export function getPageCountFromPaginatedData(
//   paginated: IPaginatedData<any>,
// ): number {
//   return getPageCountFromItemsPerPageAndItemsCount(
//     paginated.itemsPerPage,
//     paginated.itemsCount,
//   );
// }
//
// export function getPageCountFromItemsPerPageAndItemsCount(
//   itemsPerPage: number,
//   itemsCount: number,
// ): number {
//   return Math.ceil(itemsCount / itemsPerPage);
// }
//
//
// /**
//  * Extra options when getting a page
//  */
// export interface IGetPaginatedDataOptions {
//   signal?: AbortSignal;
// }
//
// /**
//  * A function to get a page
//  */
// export interface IPaginationGetPaginatedDataFunction<GData> {
//   (page: IPageInfo, options?: IGetPaginatedDataOptions): Promise<IPaginatedData<GData>>;
// }
//
//
// /**
//  * Universal wrapper to support various kind of paginations (ex: sync or async) through one interface
//  */
// export class Pagination<GData> {
//   protected readonly _getPaginatedData: IPaginationGetPaginatedDataFunction<GData>;
//
//   constructor(
//     getPaginatedData: IPaginationGetPaginatedDataFunction<GData>,
//   ) {
//     this._getPaginatedData = getPaginatedData;
//   }
//
//   /**
//    * Gets a page
//    */
//   getPaginatedData(
//     page: IPageInfo,
//     options?: IGetPaginatedDataOptions,
//   ): Promise<IPaginatedData<GData>> {
//     return this._getPaginatedData(page, options);
//   }
//
//   /**
//    * Creates an async iterator over the list of pages
//    */
//   async * pageIterator(
//     {
//       pageIndex = 0,
//       itemsPerPage = 10,
//       ...others
//     }: IPartialPageInfo = {},
//     options?: IGetPaginatedDataOptions,
//   ): AsyncGenerator<IPaginatedData<GData>, any, any> {
//     const page: IPageInfo = {
//       pageIndex,
//       itemsPerPage,
//       ...others,
//     };
//     let result: IPaginatedData<GData>;
//     let pageCount!: number;
//     do {
//       result = await this.getPaginatedData(page, options);
//       yield result;
//       pageCount = getPageCountFromPaginatedData(result);
//       page.pageIndex++;
//     } while (pageCount > page.pageIndex);
//   }
//
//   /**
//    * Creates an async iterator for each individual data
//    */
//   async * dataIterator(
//     page?: IPartialPageInfo,
//     options?: IGetPaginatedDataOptions,
//   ): AsyncGenerator<GData, any, any> {
//     const iterator: AsyncIterator<IPaginatedData<GData>> = this.pageIterator(page, options);
//     let result: IteratorResult<IPaginatedData<GData>>;
//     while (!(result = await iterator.next()).done) {
//       yield * result.value.data;
//     }
//   }
//
//   [Symbol.asyncIterator](
//     page?: IPartialPageInfo,
//     options?: IGetPaginatedDataOptions,
//   ): AsyncGenerator<GData, any, any> {
//     return this.dataIterator(page, options);
//   }
// }
//
//
// /*----------------*/
//
// export function appendPaginationToURL(
//   url: URL,
//   page: IPageInfo,
// ): URL {
//   url.searchParams.set('page', (page.pageIndex + 1).toString(10));
//   url.searchParams.set('limit', (page.itemsPerPage).toString(10));
//   return url;
// }
