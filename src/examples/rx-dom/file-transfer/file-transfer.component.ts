import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
  onNodeConnectedToWithImmediate,
} from '@lifaon/rx-dom';
import { MatProgressRingComponent } from '../material/progress/progress-ring/mat-progress-ring.component';
import {
  createNetworkErrorFromResponse, createProgress, eq$$, fromPromise, fromXHR, IFromPromiseObservableNotifications,
  IFromXHRObservableNotifications,
  IObservable, IObserver, IProgress, IUnsubscribe, let$$, letU$$, map$$, neq$$, noop, notificationObserver, single,
} from '@lifaon/rx-js-light';
import { noCORS } from '../../misc/no-cors';
// @ts-ignore
import html from './file-transfer.component.html?raw';
// @ts-ignore
import style from './file-transfer.component.scss';
import { downloadBlob, extractFileNameFromResponse } from './helpers';


/** COMPONENT **/

type IStatus = 'awaiting' | 'loading' | 'complete' | 'error';

interface IData {
  readonly status$: IObservable<IStatus>;
  readonly progress$: IObservable<number>;
  readonly errorMessage$: IObservable<string>;

  readonly onClickStartDownload: IObserver<Event>;
  readonly onClickCancelDownload: IObserver<Event>;

  readonly eq$$: typeof eq$$;
  readonly neq$$: typeof neq$$;
  readonly single: typeof single;
}

const NO_PROGRESS = createProgress(0, Number.POSITIVE_INFINITY);

@Component({
  name: 'app-file-transfer',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatProgressRingComponent,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppFileTransferComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;
  protected unsubscribeStartDownload: IUnsubscribe;

  constructor() {
    super();

    // const url = `http://ipv4.download.thinkbroadband.com/1GB.zip`;
    // const url = `http://ipv4.download.thinkbroadband.com/100MB.zip`;
    // const url = `https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip`;
    // const url = `http://212.183.159.230/100MB.zip`;
    const url = `http://212.183.159.230/10MB.zip`;
    // const url = `http://212.183.159.230/1MB.zip`;
    // http://xcal1.vodafone.co.uk/

    const request = new Request(noCORS(url));

    const startDownload$ = fromXHR(request, void 0, { useReadableStream: false });
    const $status$ = let$$<IStatus>('awaiting');
    const $error$ = letU$$<Error>();
    const $progress$ = letU$$<IProgress>();

    const status$ = $status$.subscribe;
    const progress$ = map$$($progress$.subscribe, (progress: IProgress) => (progress.loaded / progress.total));
    const errorMessage$ = map$$($error$.subscribe, (error) => error.message);

    this.unsubscribeStartDownload = noop;

    const error = (error: Error) => {
      $error$.emit(error);
      $status$.emit('error');
    };

    const onClickStartDownload = () => {
      $status$.emit('loading');
      $progress$.emit(NO_PROGRESS);

      this.unsubscribeStartDownload = startDownload$(notificationObserver<IFromXHRObservableNotifications>({
        next: (response: Response) => {
          if (response.ok) {
            const responseToBlob$ = fromPromise(response.blob());
            this.unsubscribeStartDownload = responseToBlob$(notificationObserver<IFromPromiseObservableNotifications<Blob>>({
              next: (blob: Blob) => {
                downloadBlob(blob, extractFileNameFromResponse(response));
                $status$.emit('complete');
              },
              error,
            }));
          } else {
            error(createNetworkErrorFromResponse(response));
          }
        },
        error,
        'download-progress': $progress$.emit,
      }));
    };

    const onClickCancelDownload = () => {
      this.unsubscribeStartDownload();
      $status$.emit('awaiting');
    };

    onNodeConnectedToWithImmediate(this)( (connected: boolean) => {
      if (!connected) {
        this.unsubscribeStartDownload();
      }
    });

    this.data = {
      status$,
      progress$,
      errorMessage$,

      onClickStartDownload,
      onClickCancelDownload,

      eq$$,
      neq$$,
      single,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}

