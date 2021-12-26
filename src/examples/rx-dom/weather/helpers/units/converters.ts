export const SECONDS_PER_HOUR = (60 * 60);
export const SECONDS_PER_DAY = (SECONDS_PER_HOUR * 24);
export const MS_PER_DAY = SECONDS_PER_DAY * 1000;

export const MM_PER_METER = 1000;

export const MM_PER_DAY_TO_METER_PER_SECOND = (1 / (SECONDS_PER_DAY * MM_PER_METER));

export const MM_PER_HOUR_TO_METER_PER_SECOND = (1 / (SECONDS_PER_HOUR * MM_PER_METER));


export function kelvinToCelsius(
  value: number,
): number {
  return value - 273.15;
}

export function metreToMillimetre(
  value: number,
): number {
  return value * 1000;
}
