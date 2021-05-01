import { searchArtistIterator } from './requests/search-artist';

export async function debugLastFMAPI() {
  const iterator = searchArtistIterator('bob');
  for (let i = 0; i < 12; i++) {
    console.log(await iterator.next());
  }
}
