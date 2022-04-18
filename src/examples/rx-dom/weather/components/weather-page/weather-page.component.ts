import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import html from './weather-page.component.html?raw';
// @ts-ignore
import style from './weather-page.component.scss?inline';
import {
  filter$$$, fromGeolocationPosition, fromPromise, function$$, IDefaultNotificationsUnion,
  IFromGeolocationPositionObservableNotifications, IMapFilterDiscard, INextNotification, IObservable, IObservablePipe,
  IObserver, isErrorNotification, isNextNotification, let$$, map$$, map$$$, MAP_FILTER_DISCARD, mapFilter$$,
  mergeMapS$$, mergeMapS$$$, pipe$$, pipe$$$, shareR$$, shareRL$$, single, throttleTime$$,
} from '@lirx/core';
import { getReverseNominatim, getReverseNominatimCached } from '../../api/get-reverse-nominatim/get-reverse-nominatim';
import { IGetReverseNominatimJSONResponse } from '../../api/get-reverse-nominatim/response.type';
import { Immutable, ImmutableArray } from '@lifaon/rx-store';
import { generateWeatherImage, IWeatherData } from '../../helpers/generate-weather-image/generate-weather-image';
import {
  kelvinToCelsius, MM_PER_DAY_TO_METER_PER_SECOND, MM_PER_HOUR_TO_METER_PER_SECOND, MS_PER_DAY,
} from '../../helpers/units/converters';
import {
  dateTimeFormat$$$, ILocaleToTranslations, IRelativeTimeFormatValue, ITranslations, LOCALES, numberFormat$$$,
  relativeTimeFormat$$$,
} from '@lirx/i18n';
import { IGeographicPosition } from '../../api/shared/geographic-position';
import { getWeather } from '../../api/get-weather/get-weather';
import { IDailyWeather, IGetWeatherResponse, IHourlyWeather } from '../../api/get-weather/response.type';
import { getWeatherDescriptionFromId } from '../../api/get-weather/weather-state-id/get-weather-description-from-id';

/** CONSTANTS **/

const locales$ = LOCALES.subscribe;

const TRANSLATIONS: ILocaleToTranslations = new Map<string, ITranslations>([
  ['en', new Map([
    ['translate.uvi', 'UV Indice'],
    ['translate.humidity', 'Humidity'],
    ['translate.clouds', 'Clouds'],
    ['translate.wind', 'Wind'],
  ])],
]);

/** FUNCTIONS **/

// https://github.com/bennymeier/react-weather-app/blob/master/src/App.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat

function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getWeatherStartDate(
  dt: number,
): number {
  const date = new Date(dt * 1000);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function getWeatherEndDate(
  dt: number,
): number {
  const date = new Date(dt * 1000);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  ).getTime();
}


function getWeatherImageURL(
  weather: IWeatherData,
): IObservable<string> {
  return pipe$$(fromPromise<HTMLCanvasElement>(generateWeatherImage(weather, 120)), [
    filter$$$<IDefaultNotificationsUnion<HTMLCanvasElement>, INextNotification<HTMLCanvasElement>>(isNextNotification),
    map$$$<INextNotification<HTMLCanvasElement>, string>((notification: INextNotification<HTMLCanvasElement>) => {
      return `url(${ notification.value.toDataURL() })`;
    }),
  ])
}


/** FORMAT **/

const formatRelativeDay$$$ = pipe$$$([
  relativeTimeFormat$$$(single('days'), locales$, single({
    numeric: 'auto',
    style: 'long',
  })),
  map$$$<string, string>(capitalizeFirstLetter),
]);

const formatWeekDay$$$ = pipe$$$([
  dateTimeFormat$$$(locales$, single({
    weekday: 'long',
  })),
  map$$$<string, string>(capitalizeFirstLetter),
]);


// TODO upgrade to Temporal when available
function dayDiff(
  startDate: Date,
  endDate: Date,
): number {
  if (startDate.getTime() > endDate.getTime()) {
    return -dayDiff(endDate, startDate);
  } else {
    let dayCount: number = 0;

    const _startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const _endDate: number = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

    while (_endDate > _startDate.getTime()) {
      dayCount++;
      _startDate.setDate(_startDate.getDate() + 1);
    }

    return dayCount;
  }
}


const formatDay$$$ = mergeMapS$$$<number, string>((timestamp: number): IObservable<string> => {
  const date: Date = new Date(timestamp);
  const currentDate: Date = new Date();
  const days: number = dayDiff(currentDate, date);
  if (days <= 1) {
    return pipe$$(single<IRelativeTimeFormatValue>(days), [
      formatRelativeDay$$$,
    ]);
  } else {
    return pipe$$(single<number>(timestamp), [
      formatWeekDay$$$,
    ]);
  }
});

const formatDate$$$ = dateTimeFormat$$$(locales$, single({
  month: 'short', day: 'numeric',
}));

const formatPercent$$$ = numberFormat$$$(locales$, single({
  style: 'percent',
}));

const formatNumber$$$ = numberFormat$$$(locales$, single({
  style: 'decimal',
}));

const formatPrecipitation$$$ = numberFormat$$$(locales$, single({
  style: 'unit',
  unit: 'millimeter',
  unitDisplay: 'narrow',
  maximumFractionDigits: 0,
}));

const formatOptionalPrecipitation$$$$ = (
  formatPipe: IObservablePipe<number, string>,
): IObservablePipe<number, string> => {
  return mergeMapS$$$((value: number): IObservable<string> => {
    return (value === 0)
      ? single('')
      : formatPipe(single<number>(value));
  });
};

const formatDailyPrecipitation$$$ = pipe$$$([
  map$$$<number, number>((value: number) => (value / MM_PER_DAY_TO_METER_PER_SECOND)),
  formatPrecipitation$$$,
]);

const formatOptionalDailyPrecipitation$$$ = formatOptionalPrecipitation$$$$(formatDailyPrecipitation$$$);

const formatHourlyPrecipitation$$$ = pipe$$$([
  map$$$<number, number>((value: number) => (value / MM_PER_HOUR_TO_METER_PER_SECOND)),
  formatPrecipitation$$$,
]);

const formatOptionalHourlyPrecipitation$$$ = formatOptionalPrecipitation$$$$(formatHourlyPrecipitation$$$);


const formatTemperature$$$ = pipe$$$([
  map$$$<number, number>(kelvinToCelsius),
  numberFormat$$$(locales$, single({
    style: 'unit',
    unit: 'celsius',
    unitDisplay: 'narrow',
    maximumFractionDigits: 0,
  })),
]);


const formatHour$$$ = dateTimeFormat$$$(locales$, single({
  hour: 'numeric', minute: 'numeric',
}));

const mapNotificationToOptionalErrorError$$ = map$$$((notification: IDefaultNotificationsUnion<any>): unknown | null => {
  return isErrorNotification(notification)
    ? notification.value
    : null;
});

/** COMPONENT **/

type IWeatherGranularity = 'daily' | 'hourly';

type IDailyWeatherData = Immutable<{
  day$: IObservable<string>;
  date$: IObservable<string>;
  illustration$: IObservable<string>;
  weatherTitle$: IObservable<string>;
  // probabilityOfPrecipitation$: IObservable<string>;
  precipitation$: IObservable<string>;
  minTemperature$: IObservable<string>;
  maxTemperature$: IObservable<string>;
}>;

type IHourlyWeatherData = Immutable<{
  hour$: IObservable<string>;
  illustration$: IObservable<string>;
  weatherTitle$: IObservable<string>;
  precipitation$: IObservable<string>;
  temperature$: IObservable<string>;
  humidity$: IObservable<string>;
  ultravioletIndex$: IObservable<string>;
}>;

type IHourlyWeatherDataGroupedDaily = Immutable<{
  day$: IObservable<string>;
  date$: IObservable<string>;
  hourly$: IObservable<ImmutableArray<IHourlyWeatherData>>;
}>;

type IData = Immutable<{
  // data
  errorText$: IObservable<string>;
  hasError$: IObservable<boolean>;
  place$: IObservable<string>;
  weatherGranularity$: IObservable<string>;
  weatherGranularityText$: IObservable<string>;

  dailyWeather$: IObservable<ImmutableArray<IDailyWeatherData>>;
  hourlyWeatherGroupedDaily$: IObservable<ImmutableArray<IHourlyWeatherDataGroupedDaily>>;

  // events
  onClickWeatherGranularity: IObserver<IDailyWeatherData>;
}>;

@Component({
  name: 'app-weather-page',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppWeatherPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    /* POSITION */

    const geolocationPosition$ = shareRL$$(throttleTime$$(fromGeolocationPosition(), 5 * 60 * 1000));

    const position$ = mapFilter$$(geolocationPosition$, (notification: IFromGeolocationPositionObservableNotifications): IGeographicPosition | IMapFilterDiscard => {
      return isNextNotification(notification)
        ? {
          latitude: notification.value.coords.latitude,
          longitude: notification.value.coords.longitude,
        }
        : MAP_FILTER_DISCARD;
    });

    const positionError$ = mapNotificationToOptionalErrorError$$(geolocationPosition$);


    /* PLACE */

    const reverseNominatimRequest$ = shareR$$(mergeMapS$$(position$, getReverseNominatim));

    const reverseNominatimData$ = mapFilter$$(reverseNominatimRequest$, (notification: IDefaultNotificationsUnion<IGetReverseNominatimJSONResponse>): IGetReverseNominatimJSONResponse | IMapFilterDiscard => {
      return isNextNotification(notification)
        ? notification.value
        : MAP_FILTER_DISCARD;
    });

    const reverseNominatimDataError$ = mapNotificationToOptionalErrorError$$(reverseNominatimRequest$);

    const place$ = map$$(reverseNominatimData$, (reverseNominatimData: IGetReverseNominatimJSONResponse): string => {
      return `${ reverseNominatimData.address.town } (${ reverseNominatimData.address.country })`;
    });

    /* WEATHER GRANULARITY */

    const {
      emit: $weatherGranularity,
      subscribe: weatherGranularity$,
      getValue: getWeatherGranularityValue,
    } = let$$<IWeatherGranularity>(retrieveWeatherGranularity());

    const onClickWeatherGranularity = () => {
      const weatherGranularity: IWeatherGranularity = getNextWeatherGranularity(getWeatherGranularityValue());
      storeWeatherGranularity(weatherGranularity);
      $weatherGranularity(weatherGranularity);
    };

    const weatherGranularityText$ = map$$(weatherGranularity$, getWeatherGranularityTranslated);

    /* WEATHER */

    const weatherRequest$ = shareR$$(mergeMapS$$(position$, getWeather));

    const weatherData$ = mapFilter$$(weatherRequest$, (notification: IDefaultNotificationsUnion<IGetWeatherResponse>): IGetWeatherResponse | IMapFilterDiscard => {
      return isNextNotification(notification)
        ? notification.value
        : MAP_FILTER_DISCARD;
    });

    const weatherDataError$ = mapNotificationToOptionalErrorError$$(weatherRequest$);


    /* DAILY WEATHER */

    const dailyWeather$ = map$$(weatherData$, (weatherData: IGetWeatherResponse): ImmutableArray<IDailyWeatherData> => {
      return weatherData.daily.map((dailyWeather: IDailyWeather): IDailyWeatherData => {
        const timestamp = dailyWeather.date;
        const timestamp$ = single(timestamp);

        const day$ = formatDay$$$(timestamp$);
        const date$ = formatDate$$$(timestamp$);

        // const illustration$ = single(`url(${ getWeatherImageURL(dailyData.weather[0].icon) }`);
        // const illustration$ = single(`url(${ getWeatherImageURLFromId(dailyData.state[0], false, false) }`);
        const illustration$ = getWeatherImageURL(dailyWeather);

        const weatherTitle$ = single(getWeatherDescriptionFromId(dailyWeather.state[0]));

        // const probabilityOfPrecipitation$ = formatPercent$$$(single<number>(dailyData.pop));

        const precipitation$ = formatOptionalDailyPrecipitation$$$(single<number>(dailyWeather.rain + dailyWeather.snow));

        const minTemperature$ = formatTemperature$$$(single<number>(dailyWeather.temperature.min));

        const maxTemperature$ = formatTemperature$$$(single<number>(dailyWeather.temperature.max));

        return {
          day$,
          date$,
          illustration$,
          weatherTitle$,
          // probabilityOfPrecipitation$,
          precipitation$,
          minTemperature$,
          maxTemperature$,
        };
      });
    });

    /* HOURLY WEATHER */

    const hourlyWeatherGroupedDaily$ = map$$(weatherData$, (weatherData: IGetWeatherResponse): ImmutableArray<IHourlyWeatherDataGroupedDaily> => {
      const hourlyWeatherMap = new Map<string, IHourlyWeather[]>(); // key: Y-M-D,

      for (let i = 0, l = weatherData.hourly.length; i < l; i++) {
        const hourlyWeather: IHourlyWeather = weatherData.hourly[i];
        const date = new Date(hourlyWeather.date);
        const key: string = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        let hourlyWeatherGrouped: IHourlyWeather[] | undefined = hourlyWeatherMap.get(key);
        if (hourlyWeatherGrouped === void 0) {
          hourlyWeatherGrouped = [];
          hourlyWeatherMap.set(key, hourlyWeatherGrouped);
        }
        hourlyWeatherGrouped.push(hourlyWeather);
      }


      return Array.from(hourlyWeatherMap.values(), (hourlyWeatherGrouped: IHourlyWeather[]): IHourlyWeatherDataGroupedDaily => {
        // sort from first to last
        hourlyWeatherGrouped.sort((a, b) => a.date - b.date);

        const timestamp = hourlyWeatherGrouped[hourlyWeatherGrouped.length - 1].date;
        const timestamp$ = single(timestamp);

        const day$ = formatDay$$$(timestamp$);
        const date$ = formatDate$$$(timestamp$);

        const hourly$ = single<IHourlyWeatherData[]>(
          hourlyWeatherGrouped.map((hourlyWeather: IHourlyWeather): IHourlyWeatherData => {
            const hour$ = formatHour$$$(single(hourlyWeather.date));

            const illustration$ = getWeatherImageURL(hourlyWeather);

            const weatherTitle$ = single(getWeatherDescriptionFromId(hourlyWeather.state[0]));

            const precipitation$ = formatOptionalHourlyPrecipitation$$$(single<number>(hourlyWeather.rain + hourlyWeather.snow));

            const temperature$ = formatTemperature$$$(single<number>(hourlyWeather.temperature));

            const humidity$ = formatPercent$$$(single<number>(hourlyWeather.humidity));

            const ultravioletIndex$ = formatNumber$$$(single<number>(hourlyWeather.ultravioletIndex));

            return {
              hour$,
              illustration$,
              weatherTitle$,
              precipitation$,
              temperature$,
              humidity$,
              ultravioletIndex$,
            };
          }),
        );

        return {
          day$,
          date$,
          hourly$,
        };
      });
    });

    /* ERROR */

    const error$ = function$$(
      [
        positionError$,
        reverseNominatimDataError$,
        weatherDataError$,
      ],
      (
        positionError,
        reverseNominatimDataError,
        weatherDataError,
      ): string | null => {
        if (positionError !== null) {
          return `error.position`;
        } else if (reverseNominatimDataError !== null) {
          return `error.reverse-nominatim-data`;
        } else if (weatherDataError !== null) {
          return `error.weather-data`;
        } else {
          return null;
        }
      },
    );

    const errorText$ = map$$(error$, (error: string | null): string => {
      return (error === null)
        ? ''
        : error;
    });

    const hasError$ = map$$(error$, (error: string | null) => (error !== null));

    this._data = {
      errorText$,
      hasError$,
      place$,
      weatherGranularity$,
      weatherGranularityText$,
      dailyWeather$,
      hourlyWeatherGroupedDaily$,
      onClickWeatherGranularity,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

/** FUNCTIONS **/

function getNextWeatherGranularity(
  weatherGranularity: IWeatherGranularity,
): IWeatherGranularity {
  switch (weatherGranularity) {
    case 'hourly':
      return 'daily';
    case 'daily':
      return 'hourly';
  }
}

function getWeatherGranularityTranslated(
  weatherGranularity: IWeatherGranularity,
): string {
  switch (weatherGranularity) {
    case 'hourly':
      return 'Hourly';
    case 'daily':
      return 'Daily';
  }
}


const WEATHER_GRANULARITY_KEY = 'weather-granularity';

function storeWeatherGranularity(
  weatherGranularity: IWeatherGranularity,
): void {
  localStorage.setItem(WEATHER_GRANULARITY_KEY, weatherGranularity);
}

function retrieveWeatherGranularity(): IWeatherGranularity {
  return (localStorage.getItem(WEATHER_GRANULARITY_KEY) as IWeatherGranularity | null) ?? 'hourly';
}

