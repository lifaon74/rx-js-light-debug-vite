

export function sleep(
  timeout: number,
): Promise<void> {
  return new Promise<void>((
    resolve: () => void,
  ): void => {
    setTimeout(resolve, timeout);
  });
}
