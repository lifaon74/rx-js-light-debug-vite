import { bootstrap } from '@lifaon/rx-dom';
import { YoutubePlayerComponent } from './component/youtube-player.component';

export function youtubePlayerExample() {
  bootstrap(new YoutubePlayerComponent());
}
