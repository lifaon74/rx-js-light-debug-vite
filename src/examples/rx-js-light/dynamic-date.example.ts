import {
  fromEventTarget, interval, IUnsubscribe, mapObservablePipe, pipeObservable
} from '@lifaon/rx-js-light';


export function dynamicDateExample() {
  document.body.innerHTML = '';

  /* BUTTON */
  const button = document.createElement('button');
  button.innerText = 'Click me';
  document.body.appendChild(button);

  const onClickButton = (): void => {
    if (unsubscribeToDate === void 0) {
      unsubscribeToDate = subscribeToDate(onDateChange);
    } else {
      unsubscribeToDate();
      unsubscribeToDate = void 0;
    }
  };

  /* TEXT - DATE */
  const text = new Text();
  document.body.appendChild(text);

  const onDateChange = (date: string): void => {
    text.data = date;
  };

  let unsubscribeToDate: IUnsubscribe | undefined;

  // create date subscribe function
  const subscribeToDate = pipeObservable(interval(1000), [
    mapObservablePipe<void, string>(() => new Date().toISOString())
  ]);

  // create click subscribe function
  const subscribeToClick = fromEventTarget(button, 'click');
  // listen to clicks
  subscribeToClick(onClickButton);
}

