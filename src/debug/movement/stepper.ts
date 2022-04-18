import { createTimeout, IAbortTimer } from '@lirx/core';
import { float32, int32_t, uin64_t, uint32_t, uint8_t } from './number.types';
import { getMovementDuration } from './math';
import { IMovement } from './movement.types';

export function createContext(
  width: number,
  height: number = width,
): CanvasRenderingContext2D {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = '2px solid black';
  document.body.appendChild(canvas);
  return canvas.getContext('2d') as CanvasRenderingContext2D;
}


export class Movement {
  public readonly duration: float32; // computed

  constructor(
    public readonly initialJerkNormalized: float32,
    public readonly initialAccelerationNormalized: float32,
    public readonly initialVelocityNormalized: float32,
    public readonly distance: int32_t,
  ) {
    this.duration = getMovementDuration(this);
  }

  getNormalizedDistanceAtDuration(
    duration: float32,
  ): float32 {
    return (duration > this.duration)
      ? 1
      : (
        ((this.initialJerkNormalized * (duration ** 3)) / 6)
        + ((this.initialAccelerationNormalized * (duration ** 2)) / 2)
        + (this.initialVelocityNormalized * duration)
      );
  }
}

const DIRECTION_MASK = 0b10;
const STEP_MASK = 0b01;

export function now(): uin64_t {
  return Date.now() / 1000;
}

export class ProgressingMovement {

  protected readonly startTime: uin64_t;
  protected doneDistance: uint32_t;
  protected readonly absoluteDistance: uint32_t;
  // protected readonly positiveDirection: boolean;
  protected readonly directionMask: uint8_t;

  constructor(
    public readonly movement: Movement,
  ) {
    this.startTime = now();
    this.doneDistance = 0;
    this.absoluteDistance = Math.abs(this.movement.distance);
    this.directionMask = (this.movement.distance < 0)
      ? DIRECTION_MASK
      : 0b00;
  }

  done(): boolean {
    return (this.doneDistance >= this.absoluteDistance);
  }

  update(): uint8_t {
    return this.done()
      ? 0
      : this.updateAssumingNotDone();
  }

  // INFO: assumes !done
  updateAssumingNotDone(): uint8_t {
    const elapsedTime: number = now() - this.startTime;
    if (elapsedTime > this.movement.duration) {
      this.doneDistance++;
      // console.log('*', elapsedTime, this.movement.duration);
      // console.log('*');
      return this.directionMask | STEP_MASK;
    } else {
      // console.log('->', this.movement.getNormalizedDistanceAtDuration(elapsedTime), this.absoluteDistance);
      const dx: uint8_t = (
        (this.movement.getNormalizedDistanceAtDuration(elapsedTime) * this.absoluteDistance) - this.doneDistance
      );

      if (dx < 0) {
        console.log('dx', dx);
      }

      if (dx >= 1) {
        this.doneDistance++;
        return this.directionMask | STEP_MASK;
      } else {
        return 0;
      }
    }
  }
}


export class Stepper {

  protected movements: Movement[];
  protected currentMovement: ProgressingMovement | null;

  constructor() {
    this.movements = [];
    this.currentMovement = null;
  }

  reset(): void {
    this.movements = [];
    this.currentMovement = null;
  }

  beginNextMovement(): void {
    this.currentMovement = (this.movements.length > 0)
      ? new ProgressingMovement(this.movements.shift() as Movement)
      : null;
  }

  hasNoCurrentMovement(): boolean {
    return (this.currentMovement === null);
  }

  update(): uint8_t {
    if (this.currentMovement === null) {
      return 0;
    } else {
      const step: uint8_t = this.currentMovement.update();

      if (this.currentMovement.done()) {
        this.currentMovement = null;
      }

      return step;
    }
  }

  queueMovement(
    movement: Movement,
  ): void {
    // if (movement.distance !== 0) {
      this.movements.push(movement);
    // }
  }
}


export class MultiStepper {
  public readonly steppers: readonly Stepper[];

  constructor(
    size: number,
  ) {
    this.steppers = Array.from({ length: size }, () => new Stepper());
  }


  update(): uint8_t[] {
    const allSteppersReady: boolean = this.steppers.every((stepper: Stepper): boolean => {
      return stepper.hasNoCurrentMovement();
    });

    if (allSteppersReady) {
      for (let i = 0, l = this.steppers.length; i < l; i++) {
        this.steppers[i].beginNextMovement();
      }
    }

    return this.steppers.map((stepper: Stepper): uint8_t => {
      return stepper.update();
    });
  }

  queueMovement(
    {
      initialJerkNormalized,
      initialAccelerationNormalized,
      initialVelocityNormalized,
      distances,
    }: IMovement,
  ): void {
    for (let i = 0, l = this.steppers.length; i < l; i++) {
      this.steppers[i].queueMovement(new Movement(
        initialJerkNormalized,
        initialAccelerationNormalized,
        initialVelocityNormalized,
        Math.round(distances[i]),
      ));
    }
  }
}

export class CanvasMovementRenderer {

  public readonly stepper: MultiStepper;

  constructor(
    public readonly ctx: CanvasRenderingContext2D,
  ) {
    this.stepper = new MultiStepper(2);
  }

  update(): void {
    const steps: uint8_t[] = this.stepper.update();
    // console.log(steps);
    const x: number = ((steps[0] & DIRECTION_MASK) ? -1 : 1) * (steps[0] & STEP_MASK);
    const y: number = ((steps[1] & DIRECTION_MASK) ? -1 : 1) * (steps[1] & STEP_MASK);

    if (x !== 0 || y !== 0) {
      this.ctx.translate(x, y);
      this.ctx.fillRect(0, 0, 1, 1);
    }
  }

  // start(): IAbortTimer {
  //   return createAnimationFrameLoop(() => {
  //     this.update();
  //   });
  // }

  start(): IAbortTimer {
    let loopTimeout: IAbortTimer;
    let colorLoopTimeout: IAbortTimer;

    const loop = () => {
      const start = now();

      while (now() - start < 0.01) {
        this.update();
      }

      loopTimeout = createTimeout(loop, 0);
    };

    const colorLoop = () => {
      this.ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
      colorLoopTimeout = createTimeout(colorLoop, 1000);
    };

    colorLoop();
    loop();

    return () => {
      loopTimeout();
      colorLoopTimeout();
    };
    // return createAnimationFrameLoop(() => {
    //   this.update();
    // });
  }
}


export function renderMovements(
  movements: IMovement[],
): void {
  const renderer = new CanvasMovementRenderer(createContext(512));

  renderer.ctx.canvas.style.backgroundColor = 'black';

  renderer.ctx.translate(256, 256);

  for (let i = 0, l = movements.length; i < l; i++) {
    renderer.stepper.queueMovement(movements[i]);
  }

  (window as any).stop = renderer.start();
}

