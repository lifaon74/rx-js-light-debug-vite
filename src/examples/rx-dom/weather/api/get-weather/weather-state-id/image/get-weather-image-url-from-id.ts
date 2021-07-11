import { getWeatherImageNameFromId } from './get-weather-image-name-from-id';

export function getWeatherImageURLFromId(
  id: number,
  night: boolean = false,
  animated: boolean = true,
): string {
  return `/assets/images/weather/amcharts/${ animated ? 'animated' : 'static' }/${ getWeatherImageNameFromId(id, night) }`;
}



