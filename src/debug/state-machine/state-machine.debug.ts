type ITaskState =
  'stopped'
  | 'started'
  | 'paused'
  | 'done'
  ;

interface ITaskStartFunction {
  (): void;
}

interface ITaskStopFunction {
  (): void;
}

interface ITaskOptions {
  start: ITaskStartFunction;
  stop: ITaskStopFunction;
}

class Task {
  protected _start: ITaskStartFunction;
  protected _stop: ITaskStopFunction;
  protected _isRunning: boolean;

  constructor(
    options: ITaskOptions,
  ) {
    this._start = options.start;
    this._stop = options.stop;
    this._isRunning = true;
  }

  isRunning(): boolean {
    return this._isRunning;
  }

  start(): void {
    if (!this._isRunning) {
      this._start();
      this._isRunning = true;
    }
  }

  stop(): void {
    if (this._isRunning) {
      this._stop();
      this._isRunning = false;
    }
  }
}


/*---*/


class SequentialTask extends Task {

  protected _currentTask: Task | null;
  protected _tasksIterator: Iterator<Task>;

  constructor(
    tasks: Iterable<Task>,
  ) {
    super({
      start: () => {

      },
      stop: () => {

      },
    });
    this._currentTask = null;
    this._tasksIterator = tasks[Symbol.iterator]();
  }
}


/*-------------*/

export function stateMachineDebug() {
  console.log('ok');
}

