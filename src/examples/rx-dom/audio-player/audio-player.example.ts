import { debugLastFMAPI } from './api/vendors/last-fm/debug-last-fm-api';
import { debugMusicBrainzAPI } from './api/vendors/music-brainz/debug-music-brainz-api';
import { AppAudioPlayerTransferComponent } from './components/audio-player/audio-player.component';
import { bootstrap } from '@lifaon/rx-dom';


/** BOOTSTRAP FUNCTION **/

export async function audioPlayerExample() {
  // await debugLastFMAPI();
  // await debugMusicBrainzAPI();
  bootstrap(new AppAudioPlayerTransferComponent());
}

