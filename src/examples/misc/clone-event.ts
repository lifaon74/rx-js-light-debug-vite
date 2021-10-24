export function cloneEvent<GEvent extends Event>(
  event: GEvent,
): GEvent {
  return new (event.constructor as any)(event.type, event);
}
