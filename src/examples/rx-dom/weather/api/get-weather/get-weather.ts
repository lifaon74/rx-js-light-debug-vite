import { IGetWeatherOptions } from './request.type';
import {
  IDailyTemperature, IDailyWeather, IDateRange, IGetWeatherResponse, IHourlyWeather, IMoonState, ISunState,
  IWindState
} from './response.type';
import {
  IGetOpenWeatherMapOneCallWeatherJSONResponse, IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedTemperature,
  IGetOpenWeatherMapOneCallWeatherJSONResponseDailyState, IGetOpenWeatherMapOneCallWeatherJSONResponseHavingMoonInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingSunInfo, IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHourlyState, IGetOpenWeatherMapOneCallWeatherJSONResponseWeatherSubState
} from './openweathermap/onecall/response.type';
import { getOpenWeatherMapOneCallWeather } from './openweathermap/onecall/get-open-weather-map-one-call-weather';
import { IWeatherStateId } from './weather-state-id/weather-state-id.type';
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from '../../helpers/units/converters';


// function convertOpenWeatherMapDailyDateToDateRange(
//   dt: number,
//   timezoneOffset: number,
// ): IDateRange {
//   const date = new Date(dt * 1000);
//
//   const start = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate(),
//   ).getTime();
//
//   const end = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate() + 1,
//   ).getTime();
//
//   debugger;
//   const start = Date.UTC(
//     date.getUTCFullYear(),
//     date.getUTCMonth(),
//     date.getUTCDate(),
//   ) + timezoneOffset;
//
//   const end = Date.UTC(
//     date.getUTCFullYear(),
//     date.getUTCMonth(),
//     date.getUTCDate() + 1,
//   ) + timezoneOffset;
//
//   return {
//     start,
//     end,
//   };
// }

function convertOpenWeatherMapDailyDateToTimestamp(
  dt: number,
): number {
  return dt * 1000;
}

function convertOpenWeatherMapHourlyDateToTimestamp(
  dt: number,
): number {
  return dt * 1000;
  // const date = new Date(dt * 1000);
  // return new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   date.getDate(),
  //   date.getHours(),
  // ).getTime();
}



function convertRainOrSnow(
  value: number | undefined,
  duration: number,
): number {
  return (value === void 0)
    ? 0
    : ((value / 1000) / duration);
}

function convertOpenWeatherMapTemperatureToDailyTemperature(
  temp: IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedTemperature,
): IDailyTemperature {
  return {
    morning: temp.morn,
    day: temp.day,
    evening: temp.eve,
    night: temp.night,
    min: temp.min,
    max: temp.max,
  };
}

function convertOpenWeatherMapMoonStateToMoonState(
  data: IGetOpenWeatherMapOneCallWeatherJSONResponseHavingMoonInfo,
): IMoonState {
  return {
    phase: data.moon_phase * 1000,
    rise: data.moonrise * 1000,
    set: data.moonset * 1000,
  };
}

function convertOpenWeatherMapSunStateToMoonState(
  data: IGetOpenWeatherMapOneCallWeatherJSONResponseHavingSunInfo,
): ISunState {
  return {
    rise: data.sunrise * 1000,
    set: data.sunset * 1000,
  };
}

function convertOpenWeatherMapWindStateToWindState(
  data: IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo,
): IWindState {
  return {
    direction: data.wind_deg,
    speed: data.wind_speed,
    gust: data.wind_gust,
  };
}

function convertOpenWeatherMapCloudsToNormalizedClouds(
  clouds: number,
): number {
  return clouds / 100;
}

function convertOpenWeatherMapHumidityToNormalizedHumidity(
  humidity: number,
): number {
  return humidity / 100;
}

function convertOpenWeatherMapPressureToNormalizedPressure(
  pressure: number,
): number {
  return pressure * 100;
}

function convertDaily(
  data: IGetOpenWeatherMapOneCallWeatherJSONResponseDailyState,
): IDailyWeather {
  return {
    date: convertOpenWeatherMapDailyDateToTimestamp(data.dt),
    clouds: convertOpenWeatherMapCloudsToNormalizedClouds(data.clouds),
    dewPoint: data.dew_point,
    humidity: convertOpenWeatherMapHumidityToNormalizedHumidity(data.humidity),
    moon: convertOpenWeatherMapMoonStateToMoonState(data),
    probabilityOfPrecipitation: data.pop,
    pressure: convertOpenWeatherMapPressureToNormalizedPressure(data.pressure),
    rain: convertRainOrSnow(data.rain, SECONDS_PER_DAY),
    snow: convertRainOrSnow(data.snow, SECONDS_PER_DAY),
    sun: convertOpenWeatherMapSunStateToMoonState(data),
    temperature: convertOpenWeatherMapTemperatureToDailyTemperature(data.temp),
    ultravioletIndex: data.uvi,
    wind: convertOpenWeatherMapWindStateToWindState(data),
    state: data.weather.map((weather: IGetOpenWeatherMapOneCallWeatherJSONResponseWeatherSubState): IWeatherStateId => {
      return weather.id;
    }),
  };
}


function convertHourly(
  data: IGetOpenWeatherMapOneCallWeatherJSONResponseHourlyState,
  timezoneOffset: number,
): IHourlyWeather {
  return {
    date: convertOpenWeatherMapHourlyDateToTimestamp(data.dt),
    clouds: convertOpenWeatherMapCloudsToNormalizedClouds(data.clouds),
    dewPoint: data.dew_point,
    humidity: convertOpenWeatherMapHumidityToNormalizedHumidity(data.humidity),
    probabilityOfPrecipitation: data.pop,
    pressure: convertOpenWeatherMapPressureToNormalizedPressure(data.pressure),
    rain: convertRainOrSnow(data.rain?.['1h'], SECONDS_PER_HOUR),
    snow: convertRainOrSnow(data.snow?.['1h'], SECONDS_PER_HOUR),
    temperature: data.temp,
    ultravioletIndex: data.uvi,
    visibility: data.visibility,
    wind: convertOpenWeatherMapWindStateToWindState(data),
    state: data.weather.map((weather: IGetOpenWeatherMapOneCallWeatherJSONResponseWeatherSubState): IWeatherStateId => {
      return weather.id;
    }),
  };
}


/*-----------------------------*/


export function getWeather(
  {
    latitude,
    longitude,
    // startDate,
    // endDate,
  }: IGetWeatherOptions,
  signal?: AbortSignal,
): Promise<IGetWeatherResponse> {
  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 7,
  ).getTime();

  return getOpenWeatherMapOneCallWeather({
    latitude,
    longitude,
  }, signal)
    .then((result: IGetOpenWeatherMapOneCallWeatherJSONResponse): IGetWeatherResponse => {
      return {
        latitude,
        longitude,
        startDate,
        endDate,
        // dateRange: {
        //   start: startDate,
        //   end: endDate,
        // },
        daily: result.daily.map((daily: IGetOpenWeatherMapOneCallWeatherJSONResponseDailyState): IDailyWeather => {
          return convertDaily(daily);
        }),
      };
    });
}

