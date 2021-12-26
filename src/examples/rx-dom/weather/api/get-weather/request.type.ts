import { IGeographicPosition } from '../shared/geographic-position';

export interface IGetWeatherOptions extends IGeographicPosition{
  startDate?: number;
  endDate?: number;
}
