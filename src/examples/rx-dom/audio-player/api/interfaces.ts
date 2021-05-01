
/** ARTIST **/

export interface IArtist {
  id: string;
  name: string;
}


/** TRACK **/

export interface ITrack {
  id: string;
  title: string;

  artists: IArtist[];
}
