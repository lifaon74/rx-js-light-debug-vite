
export interface IFormatDurationOptions {
  forceHours?: boolean;
  forceMinutes?: boolean;
}

export function formatDuration(
  duration: number, // in s
  {
    forceHours = false,
    forceMinutes = true,
  }: IFormatDurationOptions = {},
): string {
  let formatted: string = '';

  const hours: number = Math.floor(duration / 3600);
  duration -= hours * 3600;
  formatted += ((hours > 0) || forceHours) ? `${ hours.toString(10).padStart(2, '0') }:` : '';

  const minutes: number = Math.floor(duration / 60);
  duration -= minutes * 60;
  formatted += ((minutes > 0) || forceMinutes) ? `${ minutes.toString(10).padStart(2, '0') }:` : '';

  const seconds: number = Math.floor(duration);
  formatted += seconds.toString(10).padStart(2, '0');

  return formatted;
}
