import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './weather-page.component.html?raw';
// @ts-ignore
import style from './weather-page.component.scss';
import { getCurrentPosition } from '../../helpers/get-current-position';
import {
  fromPromise, IDefaultNotificationsUnion,
  IObserver, ILocaleToTranslationKeyToTranslationValueMap, INextNotification, IRelativeTimeFormatValueAndUnit,
  isNextNotification,
  IObservable,
  ITranslationKeyToTranslationValueMap, LOCALES, single, map$$, map$$$, pipe$$, letU$$, mergeMapS$$$, filter$$$
} from '@lifaon/rx-js-light';
import { getReverseNominatimCached } from '../../api/get-reverse-nominatim/get-reverse-nominatim';
import { IGetReverseNominatimJSONResponse } from '../../api/get-reverse-nominatim/response.type';
import { Immutable, ImmutableArray } from '@lifaon/rx-store';
import { IDailyWeather, IGetWeatherResponse } from '../../api/get-weather/response.type';
import { getWeather } from '../../api/get-weather/get-weather';
import { getWeatherImageURLFromId } from '../../api/get-weather/weather-state-id/image/get-weather-image-url-from-id';
import { getWeatherDescriptionFromId } from '../../api/get-weather/weather-state-id/get-weather-description-from-id';
import { generateWeatherImage, IWeatherData } from '../../helpers/generate-weather-image/generate-weather-image';
import {
  kelvinToCelsius, metreToMillimetre, MM_PER_DAY_TO_METER_PER_SECOND, MS_PER_DAY
} from '../../helpers/units/converters';

/** CONSTANTS **/

const locales$ = LOCALES.subscribe;

const TRANSLATIONS: ILocaleToTranslationKeyToTranslationValueMap = new Map<string, ITranslationKeyToTranslationValueMap>([
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
  relativeTimeFormat$$$(locales$, single({
    numeric: 'auto',
    style: 'long',
  })),
  map$$$<string, string>(capitalizeFirstLetter),
]);

const formatWeekDay$$$ = dateTimeFormat$$$(locales$, single({
  weekday: 'long',
}));

const formatDay$$$ = mergeMapS$$$<number, string>((timestamp: number): IObservable<string> => {
  const days: number = Math.floor((timestamp - Date.now()) / MS_PER_DAY);
  if (days <= 1) {
    return pipe$$(single<IRelativeTimeFormatValueAndUnit>({ value: days, unit: 'days' }), [
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

const formatPrecipitation$$$ = numberFormat$$$(locales$, single({
  style: 'unit',
  unit: 'millimeter',
  unitDisplay: 'narrow',
  maximumFractionDigits: 1,
}));

const formatDailyPrecipitation$$$ = pipe$$$([
  map$$$<number, number>((value: number) => (value / MM_PER_DAY_TO_METER_PER_SECOND)),
  formatPrecipitation$$$,
]);

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

/** COMPONENT **/

type IDailyState = Immutable<{
  timestamp: number;
  // data
  day$: IObservable<string>;
  date$: IObservable<string>;
  illustration$: IObservable<string>;
  weatherTitle$: IObservable<string>;
  // probabilityOfPrecipitation$: IObservable<string>;
  precipitation$: IObservable<string>;
  minTemperature$: IObservable<string>;
  maxTemperature$: IObservable<string>;
}>;

type IHourlyState = Immutable<{
  hour$: IObservable<string>;
}>;

type IData = Immutable<{
  // data
  place$: IObservable<string>;
  daily$: IObservable<ImmutableArray<IDailyState>>;
  selectedDailyForecast$: IObservable<IDailyState>;
  // hourly$: IObservable<ImmutableArray<IHourlyState>>;

  // events
  onClickDailyForecast: IObserver<IDailyState>;

  // others
  isDailyForecastSelected: (dailyForecast: IDailyState) => IObservable<boolean>;

}>;

const APP_WEATHER_PAGE_CUSTOM_ELEMENTS = [
  // AppWeatherIconComponent,
];

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  // createElement: generateCreateElementFunctionWithCustomElements(APP_WEATHER_PAGE_CUSTOM_ELEMENTS),
};

@Component({
  name: 'app-weather-page',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppWeatherPageComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    /* SELECT DAILY FORECAST */

    const $selectedDailyForecast$ = letU$$<IDailyState>();
    const selectedDailyForecast$ = $selectedDailyForecast$.subscribe;
    const onClickDailyForecast = $selectedDailyForecast$.emit;

    const isDailyForecastSelected = (dailyForecast: IDailyState): IObservable<boolean> => {
      return map$$(selectedDailyForecast$, (selectedDailyForecast: IDailyState) => (selectedDailyForecast === dailyForecast));
    };

    /* WEATHER */

    const $weatherData$ = letU$$<IGetWeatherResponse>();
    const weatherData$ = $weatherData$.subscribe;

    // const daily$ = single([]);
    // const hourly$ = single([]);

    const daily$ = map$$(weatherData$, (weatherData: IGetWeatherResponse): ImmutableArray<IDailyState> => {
      return weatherData.daily.map((dailyData: IDailyWeather): IDailyState => {
        const timestamp = dailyData.date;
        const timestamp$ = single(timestamp);

        const day$ = formatDay$$$(timestamp$);
        const date$ = formatDate$$$(timestamp$);

        // const illustration$ = single(`url(${ getWeatherImageURL(dailyData.weather[0].icon) }`);
        // const illustration$ = single(`url(${ getWeatherImageURLFromId(dailyData.state[0], false, false) }`);
        const illustration$ = getWeatherImageURL(dailyData);

        const weatherTitle$ = single(getWeatherDescriptionFromId(dailyData.state[0]));

        // const probabilityOfPrecipitation$ = formatPercent$$$(single<number>(dailyData.pop));

        const precipitation$ = ((dailyData.rain === void 0) || (dailyData.rain === 0))
          ? single('')
          : formatDailyPrecipitation$$$(single<number>(dailyData.rain));

        const minTemperature$ = formatTemperature$$$(single<number>(dailyData.temperature.min));

        const maxTemperature$ = formatTemperature$$$(single<number>(dailyData.temperature.max));

        return {
          timestamp,
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

    // const hourly$ = function$$([
    //   weatherData$,
    //   selectedDailyForecast$,
    // ], (
    //   weatherData: IGetWeatherJSONResponse,
    //   selectedDailyForecast: IDailyState,
    // ): ImmutableArray<IHourlyState> => {
    //   const dailyForecastTimestamp: number = selectedDailyForecast.timestamp;
    //   const dailyForecastTimestampEnd: number = dailyForecastTimestamp + MS_PER_DAY;
    //
    //   return weatherData.hourly
    //     .filter((hourlyData: IGetWeatherJSONResponseHourlyState): boolean => {
    //       const timestamp = hourlyData.dt * 1000;
    //       return (dailyForecastTimestamp <= timestamp)
    //         && (timestamp < dailyForecastTimestampEnd);
    //     })
    //     .map((hourlyData: IGetWeatherJSONResponseHourlyState): IHourlyState => {
    //       const timestamp = hourlyData.dt * 1000;
    //       const timestamp$ = single(timestamp);
    //
    //       const hour$ = formatHour$$$(timestamp$);
    //
    //       return {
    //         hour$,
    //       };
    //     });
    // });

    /* PLACE */

    const $reverseNominatimData$ = letU$$<IGetReverseNominatimJSONResponse>();
    const reverseNominatimData$ = $reverseNominatimData$.subscribe;


    const place$ = map$$(reverseNominatimData$, (reverseNominatimData: IGetReverseNominatimJSONResponse): string => {
      return `${ reverseNominatimData.address.town } (${ reverseNominatimData.address.country })`;
    });

    // fromGeolocationPosition()((notification) => {
    //   console.log(notification);
    // });

    /* LOAD */

    getCurrentPosition()
      .then((position: GeolocationPosition) => {
        const options = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        // return Promise.all([
        //   getWeather(options),
        //   getReverseNominatim(options),
        // ]);
        return Promise.all([
          getWeather(options),
          getReverseNominatimCached(options),
        ]);
      })
      .then(([weatherData, reverseNominatimData]: [IGetWeatherResponse, IGetReverseNominatimJSONResponse]) => {
        console.log(weatherData);
        // generateWeatherImage( weatherData.daily[0], 100);
        // console.log(reverseNominatimData);
        $weatherData$.emit(weatherData);
        $reverseNominatimData$.emit(reverseNominatimData);
      });

    this._data = {
      place$,
      daily$,
      selectedDailyForecast$,
      // hourly$,
      onClickDailyForecast,
      isDailyForecastSelected,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

