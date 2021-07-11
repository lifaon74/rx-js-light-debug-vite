export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise<GeolocationPosition>((
    resolve: (value: GeolocationPosition) => void,
    reject: (reason: GeolocationPositionError) => void,
  ): void => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


