import { bootstrap } from '@lirx/dom';
import { YoutubePlayerComponent } from './component/youtube-player.component';

export function youtubePlayerExample() {
  bootstrap(new YoutubePlayerComponent());
}
