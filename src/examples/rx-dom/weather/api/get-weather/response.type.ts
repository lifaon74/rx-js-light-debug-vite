import { IWeatherStateId } from './weather-state-id/weather-state-id.type';

/** RESPONSE **/

export interface IDateRange {
  start: number; // unix timestamp
  end: number; // unix timestamp
}

export interface IMoonState {
  phase: number; // [0, 1[
  rise: number; // unix timestamp when the moon rises
  set: number; // unix timestamp when the moon sets
}

export interface ISunState {
  rise: number; // unix timestamp when the sun rises
  set: number; // unix timestamp when the sun sets
}

export interface IWindState {
  direction: number; // wind direction => degrees (meteorological)
  speed: number; // wind speed => m/s
  gust?: number; // wind gust => m/s
}

export interface IDailyTemperature { // kelvin
  morning: number;
  day: number;
  evening: number;
  night: number;
  min: number;
  max: number;
}

export interface IWaterDropQuantity {
  quantity: number; // quantity of rain or snow per second => metre/s
  total: number; // quantity of rain or snow => metre
}

export interface IDailyWeather {
  date: number; // unix timestamp
  // dateRange: IDateRange; // unix timestamp at 00:00 of the day
  clouds: number; // percent of clouds => [0, 1]
  dewPoint: number; // temperature of dew => kelvin
  humidity: number; // humidity => [0, 1]
  moon: IMoonState;
  probabilityOfPrecipitation: number; // [0, 1]
  pressure: number; // atmospheric pressure => pascal (kg / (m * s^2))
  rain: number; // quantity of rain => m/s
  snow: number; // quantity of snow => m/s
  sun: ISunState;
  temperature: IDailyTemperature;
  ultravioletIndex: number;
  wind: IWindState;
  state: IWeatherStateId[];
}


export interface IHourlyWeather {
  date: number; // unix timestamp
  // dateRange: IDateRange; // unix timestamp at 00:00 of the hour
  clouds: number; // percent of clouds => [0, 1]
  dewPoint: number; // temperature of dew => kelvin
  humidity: number; // humidity => [0, 1]
  probabilityOfPrecipitation: number; // [0, 1]
  pressure: number; // atmospheric pressure => Pa (kg / (m * s^2))
  rain: number; // quantity of rain per second => m/s
  snow: number; // quantity of snow per second => m/s
  temperature: number; // kelvin
  ultravioletIndex: number;
  visibility: number; // average visibility => metre
  wind: IWindState;
  state: IWeatherStateId[];
}


// RESPONSE

export interface IGetWeatherResponse {
  latitude: number;
  longitude: number;
  startDate: number;
  endDate: number;
  // dateRange: IDateRange;
  daily: IDailyWeather[];
  hourly: IHourlyWeather[];
}
