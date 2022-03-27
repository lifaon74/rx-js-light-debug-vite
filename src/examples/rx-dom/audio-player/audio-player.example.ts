import { debugLastFMAPI } from './api/vendors/last-fm/debug-last-fm-api';
import { debugMusicBrainzAPI } from './api/vendors/music-brainz/debug-music-brainz-api';
import { AppAudioPlayerComponent } from './components/audio-player/audio-player.component';
import { bootstrap } from '@lifaon/rx-dom';

// https://www.androidauthority.com/best-music-player-apps-for-android-208990/

/** BOOTSTRAP FUNCTION **/

export async function audioPlayerExample() {
  // await debugLastFMAPI();
  // await debugMusicBrainzAPI();
  bootstrap(new AppAudioPlayerComponent());
}

