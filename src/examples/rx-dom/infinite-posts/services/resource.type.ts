
export type IResourceKind =
  'image'
  | 'youtube'
  // | 'html'
  ;

export interface IResource {
  kind: IResourceKind;
}

export interface IImageResource extends IResource {
  kind: 'image';
  url: string;
}

export interface IYoutubeResource extends IResource {
  url: string;
}



// export interface IHTMLResource extends IResource {
//   html: string;
// }
