

export function getWeatherDescriptionFromId(
  id: number,
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
      return 'Thunderstorm';
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
      return 'Drizzle';
    // Rain
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    case 520:
    case 521:
    case 522:
    case 531:
      return 'Rainy';
    // Snow
    case 513:
    case 600:
    case 601:
    case 611:
    case 602:
    case 613:
    case 615:
    case 620:
    case 616:
    case 621:
    case 622:
      return 'Snowy';
    // Clear
    case 800:
      return 'Sunny';
    // Clouds
    case 804:
    case 801:
    case 802:
    case 803:
      return 'Cloudy';
    default:
      throw new Error(`Unknown id`);
  }
}


