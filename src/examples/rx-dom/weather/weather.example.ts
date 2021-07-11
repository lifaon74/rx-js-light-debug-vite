import { AppWeatherPageComponent } from './components/weather-page/weather-page.component';
import { bootstrap } from '@lifaon/rx-dom';


/** BOOTSTRAP FUNCTION **/

export async function weatherExample() {
  bootstrap(new AppWeatherPageComponent());
}

