import { IWeatherIconFullCode } from './response.type';


export function getOpenWeatherMapOneCallWeatherImageURL(
  icon: IWeatherIconFullCode,
  scaling: number = 2,
): string {
  return `http://openweathermap.org/img/wn/${ icon }@${ scaling }x.png`;
}


