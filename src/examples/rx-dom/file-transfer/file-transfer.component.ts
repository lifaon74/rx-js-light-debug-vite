import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT, generateCreateElementFunctionWithCustomElements,
  OnCreate, OnDisconnect
} from '@lifaon/rx-dom';
import { AppProgressRingComponent } from '../progress-ring/progress-ring.component';
import {
  createMulticastReplayLastSource, createNetworkErrorFromResponse, createProgress, fromPromise, fromXHR, IEmitFunction,
  IProgress, ISubscribeFunction, ISubscribeFunctionFromPromiseNotifications, ISubscribeFunctionFromXHRNotifications,
  IUnsubscribeFunction, mapSubscribePipe, noop, notificationObserver, pipeSubscribeFunction
} from '@lifaon/rx-js-light';
import { noCORS } from '../../misc/no-cors';
// @ts-ignore
import html from './file-transfer.component.html?raw';
// @ts-ignore
import style from './file-transfer.component.scss';
import { downloadBlob, extractFileNameFromResponse } from './helpers';


export const APP_FILE_TRANSFER_CUSTOM_ELEMENTS = [
  AppProgressRingComponent,
];

/** COMPONENT **/

type IStatus = 'awaiting' | 'loading' | 'complete' | 'error';

interface IData {
  status: ISubscribeFunction<IStatus>;
  progress: ISubscribeFunction<number>;
  error: ISubscribeFunction<Error>;

  onClickStartDownload: IEmitFunction<Event>;
  onClickCancelDownload: IEmitFunction<Event>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_FILE_TRANSFER_CUSTOM_ELEMENTS)
};

@Component({
  name: 'app-file-transfer',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppFileTransferComponent extends HTMLElement implements OnCreate<IData>, OnDisconnect {
  protected readonly data: IData;
  protected unsubscribeStartDownload: IUnsubscribeFunction;

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
    const $status$ = createMulticastReplayLastSource<IStatus>({ initialValue: 'awaiting' });
    const $error$ = createMulticastReplayLastSource<Error>();
    const $progress$ = createMulticastReplayLastSource<IProgress>();

    const progressAsNumber$ = pipeSubscribeFunction($progress$.subscribe, [
      mapSubscribePipe<IProgress, number>((progress: IProgress) => (progress.loaded / progress.total)),
    ]);

    this.unsubscribeStartDownload = noop;

    const error = (error: Error) => {
      $error$.emit(error);
      $status$.emit('error');
    };

    const onClickStartDownload = () => {
      $status$.emit('loading');
      $progress$.emit(createProgress(0, Number.POSITIVE_INFINITY));

      this.unsubscribeStartDownload = startDownload$(notificationObserver<ISubscribeFunctionFromXHRNotifications>({
        next: (response: Response) => {
          if (response.ok) {
            const responseToBlob$ = fromPromise(response.blob());
            this.unsubscribeStartDownload = responseToBlob$(notificationObserver<ISubscribeFunctionFromPromiseNotifications<Blob>>({
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

    this.data = {
      status: $status$.subscribe,
      progress: progressAsNumber$,
      error: $error$.subscribe,

      onClickStartDownload,
      onClickCancelDownload,
    };
  }

  public onCreate(): IData {
    return this.data;
  }

  public onDisconnect(): void {
    this.unsubscribeStartDownload();
  }
}

