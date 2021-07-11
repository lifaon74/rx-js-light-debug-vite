/** RESPONSE **/

/*---- WEATHER STATE ----*/

// SHARED

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTimestamp {
  dt: number; // Current time, Unix, UTC
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingVisibilityInfo {
  visibility: number; // Average visibility, metres
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingProbabilityOfPrecipitationInfo {
  pop: number; // Probability of precipitation
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo {
  wind_speed: number; // Wind speed. Wind speed. Units – default: metre/sec
  wind_gust?: number; // Wind gust. Units – default: metre/sec
  wind_deg: number; // Wind direction, degrees (meteorological)
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWeatherInfo {
  weather: IGetOpenWeatherMapOneCallWeatherJSONResponseWeatherSubState[];
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseWeatherSubState {
  id: number; // https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
  main: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
  description: string;
  icon: IWeatherIconFullCode; // https://openweathermap.org/weather-conditions#How-to-get-icon-URL
}

export type IWeatherIconDayCode = 'd';
export type IWeatherIconNightCode = 'n';
export type IWeatherIconDayOrNightCode = IWeatherIconDayCode | IWeatherIconNightCode;

export type IWeatherIconCode =
  '01'
  | '02'
  | '03'
  | '04'
  | '09'
  | '10'
  | '11'
  | '13'
  | '50'
  ;

export type IWeatherIconFullCode = `${ IWeatherIconCode }${ IWeatherIconDayOrNightCode }`;


/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingRainSnowInfo {
  rain?: number; // Precipitation volume, mm
  snow?: number; // Snow volume, mm
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAdvancedRainSnowInfo {
  rain?: IGetOpenWeatherMapOneCallWeatherJSONResponseRainState;
  snow?: IGetOpenWeatherMapOneCallWeatherJSONResponseSnowState;
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseRainState {
  '1h'?: number; // Rain volume for last hour, mm
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseSnowState {
  '1h'?: number; // Snow volume for last hour, mm
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingSunInfo {
  sunrise: number; // Sunrise time, Unix, UTC
  sunset: number; // Sunset time, Unix, UTC
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingMoonInfo {
  moonrise: number; // The time of when the moon rises for this day, Unix, UTC
  moonset: number; // The time of when the moon sets for this day, Unix, UTC
  moon_phase: number;
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTemperatureInfo {
  temp: number; // Temperature. Units - default: kelvin
  feels_like: number;
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAdvancedTemperatureInfo {
  temp: IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedTemperature;
  feels_like: IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedFeelLikeTemperature;
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedTemperature {
  morn: number; // Morning temperature.
  day: number; // Day temperature.
  eve: number; // Evening temperature.
  night: number; // Night temperature.
  min: number; // Min daily temperature.
  max: number; // Max daily temperature.
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseAdvancedFeelLikeTemperature {
  morn: number; // Morning temperature.
  day: number; // Day temperature.
  eve: number; // Evening temperature.
  night: number; // Night temperature.
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingPressureInfo {
  pressure: number; // Atmospheric pressure on the sea level, hPa
  humidity: number; // Humidity, %
  dew_point: number; // Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Units – default: kelvin
}

/*--*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCloudInfo {
  clouds: number; // Cloudiness, %
  uvi: number; // Current UV index
}


// CURRENT STATE

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseCurrentState extends
  // extends
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTimestamp,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAdvancedRainSnowInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWeatherInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingSunInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTemperatureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingPressureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCloudInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingVisibilityInfo
  //
{
}

// MINUTELY STATE

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseMinutelyState extends
  // extends
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTimestamp
  //
{
  precipitation: number; // Precipitation volume, mm;
}

// HOURLY STATE

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHourlyState extends
  // extends
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTimestamp,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAdvancedRainSnowInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWeatherInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTemperatureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingPressureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCloudInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingVisibilityInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingProbabilityOfPrecipitationInfo
  //
{
}

// DAILY STATE

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseDailyState extends
  // extends
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingTimestamp,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWindInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingRainSnowInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingWeatherInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingSunInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingMoonInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingPressureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCloudInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAdvancedTemperatureInfo,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingProbabilityOfPrecipitationInfo
  //
{
}


/*---- ALERT ----*/

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}


/*---- RESPONSE ----*/

// SHARED

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseSharedState {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCurrentWeatherState {
  current: IGetOpenWeatherMapOneCallWeatherJSONResponseCurrentState;
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingHourlyWeatherState {
  hourly: IGetOpenWeatherMapOneCallWeatherJSONResponseHourlyState[];
}

export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingDailyWeatherState {
  daily: IGetOpenWeatherMapOneCallWeatherJSONResponseDailyState[];
}


export interface IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAlerts {
  alerts: IGetOpenWeatherMapOneCallWeatherJSONResponseAlert[];
}


// RESPONSE

export interface IGetOpenWeatherMapOneCallWeatherJSONResponse extends
  // extends
  IGetOpenWeatherMapOneCallWeatherJSONResponseSharedState,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingCurrentWeatherState,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingHourlyWeatherState,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingDailyWeatherState,
  IGetOpenWeatherMapOneCallWeatherJSONResponseHavingAlerts
  //
{
}
