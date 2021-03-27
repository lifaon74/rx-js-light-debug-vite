/*
  ISSUE:

    It's extremely frequent to start async tasks like:
     - http request (fetch)
     - events listener (createEventListener)
     - or timers (setInterval)

    However most of the time (mostly due to laziness) developers don't handle cancellation (AbortSignal, removeEventListener, clearInterval),
    leading to 'memory leak', unwanted concurrent / duplicate tasks, or incorrect resolve order.

  SOLUTION:

    Observables are lazy sources which when unsubscribed, release their resources and cancel any pending tasks.
    So every async job, SHOULD start from an Observable.
*/


export function cancellationExample() {
  // TODO
}
