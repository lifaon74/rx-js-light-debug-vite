import {
  debounceTimeObservablePipe, fromEventTarget, fromFetch, fromPromise, IDefaultNotificationsUnion, IObservable,
  IObservableFromFetchNotifications, IUnsubscribe, mergeMapObservablePipe,
  mergeMapObservablePipeWithNotifications, noop, notificationObserver, pipeObservable
} from '@lifaon/rx-js-light';



const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';

interface IAPIResponseJSON {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function withoutObservable() {
  const container = document.body;

  const button = document.createElement('button');
  button.innerText = 'do request';
  container.appendChild(button);

  const resultContainer = document.createElement('div');
  container.appendChild(resultContainer);


  const callAPI = () => {
    return fetch(API_URL)
      .then((response: Response) => response.json());
  };

  const doRequest = () => {
    callAPI()
      .then(
        (data: IAPIResponseJSON) => {
          console.log(data);
          button.parentNode?.removeChild(button);
          resultContainer.innerText = `Request succeed`;
        },
        () => {
          resultContainer.innerText = `Request failed`;
        }
      )
    ;
  };

  button.onclick = () => {
    doRequest();
  };

  /*
  ISSUES:

    If the user clics 2 times or more on the button, we don't debounce nor cancel the API calls,
    resulting into unnecessary additional api calls, and even potential dangerous duplicate API calls.
    Moreover the code will throw because the 'button' may be removed twice

  */
}

function withObservableWithoutCancel() {
  const container = document.body;

  const button = document.createElement('button');
  button.innerText = 'do request';
  container.appendChild(button);

  const resultContainer = document.createElement('div');
  container.appendChild(resultContainer);

  const subscribe = pipeObservable(fromEventTarget<'click', MouseEvent>(button, 'click'), [ // creates an observable listening to 'clicks' on 'button'
    debounceTimeObservablePipe<MouseEvent>(1000), // if the user clics twice or more, we only keep the last event for a period of 1000ms
    mergeMapObservablePipe<MouseEvent, IObservableFromFetchNotifications>( // mergeMap maps incoming values and converts an Observable of Observables into a lower order Observable
      () => fromFetch(API_URL), // creates an Observable performing an http request using the fetch API
      1, // limit to one the number of parallel merged Observables (optimization)
    ),
    mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, IAPIResponseJSON>( // same as mergeMap but works with notifications instead
      (response: Response) => fromPromise<IAPIResponseJSON>(response.json()), // creates an Observable from a Promise
      1,
    ),
  ]);

  subscribe(notificationObserver({
    next: (data: IAPIResponseJSON) => {
      console.log(data);
      button.parentNode?.removeChild(button);
      resultContainer.innerText = `Request succeed`;
    },
    error: () => {
      resultContainer.innerText = `Request failed`;
    }
  }));
}

function withObservableAndCancel() {
  // TODO not finished
  const container = document.body;

  const doRequestButton = document.createElement('button');
  doRequestButton.innerText = 'do request';
  container.appendChild(doRequestButton);

  const cancelRequestButton = document.createElement('button');
  cancelRequestButton.innerText = 'cancel request';
  container.appendChild(cancelRequestButton);
  cancelRequestButton.disabled = true;

  const resultContainer = document.createElement('div');
  container.appendChild(resultContainer);

  const callAPI = pipeObservable(fromFetch(API_URL), [ // creates an Observable performing an http request using the fetch API
    mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, IAPIResponseJSON>( // maps incoming values and converts an Observable of Observables into a lower order Observable
      (response: Response) => fromPromise<IAPIResponseJSON>(response.json()), // creates an Observable from a Promise
      1, // limit to 1 the number of parallel merged Observables (optimization)
    ),
  ]);

  const onClickDoRequest = pipeObservable(fromEventTarget<'click', MouseEvent>(doRequestButton, 'click'), [ // creates an Observable listening to 'clicks' on 'button'
    debounceTimeObservablePipe<MouseEvent>(1000), // if the user clics twice or more, we only keep the last event for a period of 1000ms
  ]);

  const onClickCancelRequest = fromEventTarget<'click', MouseEvent>(cancelRequestButton, 'click');


  let unsubscribeCallAPI: IUnsubscribe = noop;

  const doRequest = () => {
    doRequestButton.disabled = true;
    unsubscribeCallAPI(); // cancels previous request

    unsubscribeCallAPI = callAPI(notificationObserver({
      next: (data: IAPIResponseJSON) => {
        console.log(data);
        doRequestButton.parentNode?.removeChild(doRequestButton);
        resultContainer.innerText = `Request succeed`;
      },
      error: () => {
        resultContainer.innerText = `Request failed`;
      }
    }));
  };

  onClickDoRequest(doRequest);
}

export function customElementExample() {
  // withoutObservable();
  // withObservableWithoutCancel();
  withObservableAndCancel();
}
