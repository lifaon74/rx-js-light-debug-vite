import { fetchJSON } from '../../helpers/fetch-json';
import { MUSIC_BRAINZ_API_URL } from './music-brainz-config.constant';
import { musicBrainzSearchRecording } from './requests/music-brainz-search-recording';


function searchArtist(
  query: string,
): Promise<any> {
  const url: URL = new URL(`${ MUSIC_BRAINZ_API_URL }artist`);
  url.searchParams.set('fmt', 'json');
  url.searchParams.set('query', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('offset', '0');
  return fetchJSON(url.href);
}

/*------------------*/

async function debugMusicBrainzAPISearchTrack() {
  // const query = `Life Is Beautiful`;
  const query = `lies of the beautiful people`;
  const result = await musicBrainzSearchRecording({
    query,
  });
  console.log(result);
}

async function debugMusicBrainzAPISearchArtist() {
  const name = `Sixx:A.M.`;
  const result = await searchArtist(name);
  console.log(result);
}

/*------------------*/

export async function debugMusicBrainzAPI() {
  await debugMusicBrainzAPISearchTrack();
  // await debugMusicBrainzAPISearchArtist();
}
