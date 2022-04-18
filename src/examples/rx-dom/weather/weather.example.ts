import { AppWeatherPageComponent } from './components/weather-page/weather-page.component';
import { bootstrap } from '@lirx/dom';


/** BOOTSTRAP FUNCTION **/

export async function weatherExample() {
  bootstrap(new AppWeatherPageComponent());
}

