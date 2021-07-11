

export function getWeatherImageNameFromId(
  id: number,
  night: boolean,
): string {
  switch (id) {
    // Thunderstorm
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      return 'thunder.svg';
    // Drizzle
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
      return 'rainy-7.svg';
    // Rain
    case 500:
      return 'rainy-1.svg';
    case 501:
    case 502:
      return 'rainy-2.svg';
    case 503:
    case 504:
      return 'rainy-3.svg';
    case 520:
      return 'rainy-4.svg';
    case 521:
      return 'rainy-5.svg';
    case 522:
    case 531:
      return 'rainy-6.svg';
    // Snow
    case 513:
    case 600:
      return 'snowy-1.svg';
    case 601:
    case 611:
      return 'snowy-2.svg';
    case 602:
      return 'snowy-3.svg';
    case 613:
    case 615:
    case 620:
      return 'snowy-4.svg';
    case 616:
      return 'snowy-5.svg';
    case 621:
    case 622:
      return 'snowy-6.svg';
    // Clear
    case 800:
      return night
        ? 'night.svg'
        : 'day.svg';
    // Clouds
    case 804:
      return 'cloudy.svg';
    case 801:
      return night
        ? 'cloudy-night-1.svg'
        : 'cloudy-day-1.svg';
    case 802:
      return night
        ? 'cloudy-night-2.svg'
        : 'cloudy-day-2.svg';
    case 803:
      return night
        ? 'cloudy-night-2.svg'
        : 'cloudy-day-2.svg';
    default:
      throw new Error(`Unknown id`);
  }
}


