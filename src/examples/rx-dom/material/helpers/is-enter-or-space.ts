export function isEnterOrSpace(
  event: KeyboardEvent,
): boolean {
  return (event.key === 'Enter')
    || (event.key === ' ');
}
