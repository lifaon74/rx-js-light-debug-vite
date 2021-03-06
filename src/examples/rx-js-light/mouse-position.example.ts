import { fromEventTarget, Subscription } from '@lifaon/rx-js-light';

/**
 * 704B bundled
 */
export function mousePositionExample() {
  const subscription = new Subscription(
    fromEventTarget<'mousemove', MouseEvent>(window, 'mousemove'),
    (event: MouseEvent) => {
      console.log(event.clientX, event.clientY);
    },
  );

  const subscribe = fromEventTarget(window, 'click');

  subscribe(() => {
    subscription.toggle();
  });
}
