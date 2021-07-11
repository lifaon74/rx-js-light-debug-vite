export type IGetOpenWeatherMapOneCallWeatherOptionsExclude =
  'current'
  | 'minutely'
  | 'hourly'
  | 'daily'
  | 'alerts'
  ;

export type IGetOpenWeatherMapOneCallWeatherOptionsUnit =
  'standard'
  | 'metric'
  | 'imperial'
  ;

export interface IGetOpenWeatherMapOneCallWeatherOptions {
  latitude: number;
  longitude: number;
  exclude?: IGetOpenWeatherMapOneCallWeatherOptionsExclude[];
  units?: IGetOpenWeatherMapOneCallWeatherOptionsUnit; // (default: 'standard')
  lang?: string;
}
