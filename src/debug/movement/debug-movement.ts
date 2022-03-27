import {
  IConstrainedMultiAxisMovement, IConstrainedSingleAxisMovement, IMovement, IMovementConstraint,
} from './movement.types';
import { CanvasMovementRenderer, createContext, renderMovements } from './stepper';
import { getMovementDuration } from './math';


/*
https://en.wikipedia.org/wiki/Jerk_(physics)

 */

/*
{1} a = a
{2} v = (a * t) + vi
{3} d = (0.5 * a * t²) + (vi * t) + di


COMPUTE t

having: a, v, vi
->{2} v = (a * t) + vi
{t.1} t = (v - vi) / a

having: a, d, vi
->{3} d = (0.5 * a * t²) + (vi * t) + di
delta = vi² - (2 * a * (di - d))
{t.2} t = (-vi +- sqrt(delta)) / a


COMPUTE a

having: t, d, vi
->{3}  d = (0.5 * a * t²) + (vi * t) + di
       a = (d - (vi * t) - di) / (0.5 * t²)
{a.1}  a = ((d - di) - (vi * t)) / (0.5 * t²)
{a.1'} a = (((d - di) - (vi * t)) * 2) / t²


COMPUTE d

having: a, v, vi
->{t.1} t = (v - vi) / a
->{3}   d = (0.5 * a * t²) + (vi * t) + di
->{d.1} d = (v² - vi²) / (2 * a) + di

--

a² * x + b* x + c = 0
d = b² - 4 * a * c
y = (-b +- sqrt(d)) / 2a

--

R = Reals = ]-∞, +∞[
R+ = Positive Reals = [0, +∞[
R++ = Non Zero Positive Reals = ]0, +∞[

un mouvement (M) est composé d'une vitesse initiale, d'une acceleration et d'une distance par axe
chaque axe est contraint par une acceleration, une vitesse max et un "jerk" entre deux mouvements

mouvement optimisé: [...distances par axe (R), vitesse initiale (R+), acceleration (R+)]

calculer pour M1 sa vitesse finale maximale atteignable par axe
pour ce faire:
- calculer pour chaque axe le temps qu'il faut: (4) => t[i],
 en utilisant les contraintes max de l'axe (a = a_max, vi = ancien vi, d = distance a faire, et v_max)
- prendre le max parmi tous ces temps => m1_t_max = max(...t[i])
- calculer vf par axe: (2) => vf[i] = min(a_max[i] * t[i] + vi[i], v_max[i])

calculer pour M2 sa vitesse initiale max par axe:
- le calcule est similaire au precedent mais en inverse

comparer vf_m1[i] avec vi_m2[i]: // TODO prendre en compte les valeurs negatives
- vf_m1[i] <= vi_m2[i], alors ce mouvement est realisable sans problème pour cet axe
- (vf_m1[i] + jerk_m1) <= (vi_m2[i] - jerk_m2), alors ce mouvement est realisable avec jerk
- sinon: il faut réduire vi_m2[i]
=> vi_m2[i] = valeur la plus proche de zero pour (vf_m1[i] + jerk_m1, vi_m2[i] - jerk_m2)


 */


/*-----------------*/

const EPSILON: number = 1e-8;

/*-----------------*/


export interface IDurationWithAxisIndex {
  duration: number;
  axisIndex: number;
}

/*-----------------*/


function logMovementDetails(
  movement: IMovement,
): void {
  const duration: number = getMovementDuration(movement);

  console.log(`duration: ${duration}`);

  const {
    initialJerkNormalized,
    initialAccelerationNormalized,
    initialVelocityNormalized,
    distances,
  } = movement;

  for (let i = 0, l = distances.length; i < l; i++) {
    const distance: number = distances[i];

    const initialJerk: number = initialJerkNormalized * distance;
    const initialAcceleration: number = initialAccelerationNormalized * distance;
    const initialVelocity: number = initialVelocityNormalized * distance;

    // const terminalAcceleration: number = initialJerk * duration;
    // const terminalVelocity: number = (initialJerk / 2) * (duration ** 2) + initialAcceleration;
    // const terminalDistance: number = (initialJerk / 6) * (duration ** 3)
    //   + (initialAcceleration / 2) * (duration ** 2)
    //   + (initialVelocity * duration);

    const terminalAcceleration: number = (initialJerk * duration)
      + initialAcceleration;
    const terminalVelocity: number = ((initialJerk / 2) * (duration ** 2))
      + (initialAcceleration * duration)
      + initialVelocity;
    const terminalDistance: number = (initialJerk / 6) * (duration ** 3)
      + (initialAcceleration / 2) * (duration ** 2)
      + (initialVelocity * duration);

    const data: [string, any][] = [
      ['distance', distance],
      ['initial jerk', initialJerk],
      ['initial acceleration', initialAcceleration],
      ['initial velocity', initialVelocity],
      ['terminal acceleration', terminalAcceleration],
      ['terminal velocity', terminalVelocity],
      ['terminal distance', terminalDistance],
    ];

    const dataString: string = data.map(([key, value]) => `\t${key}: ${value}`).join('\n');

    console.log(`axis #${i}\n${dataString}`);

  }
}

/*-----------------*/

/* JERK */

function computeMultiAxisMovementJerkDurationToReachDistanceAtMaxJerk(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  distanceRatio: number,
): IDurationWithAxisIndex {
  const length: number = multiAxisMovement.length;

  // duration to reach distance at maxJerk
  let duration: number = 0;
  let axisIndex: number = -1;

  for (let i = 0; i < length; i++) {
    const {
      maxJerk,
      distance,
    } = multiAxisMovement[i];

    const singleAxisDurationToReachDistanceAtMaxJerk: number = Math.cbrt((6 * Math.abs(distance) * distanceRatio) / maxJerk);

    if (singleAxisDurationToReachDistanceAtMaxJerk > duration) {
      axisIndex = i;
      duration = singleAxisDurationToReachDistanceAtMaxJerk;
    }
  }

  return {
    duration,
    axisIndex,
  };
}

function computeMultiAxisMovementJerkDurationToReachMaxAccelerationOrMaxVelocityOrDistanceAtMaxJerk(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  {
    duration,
    axisIndex,
  }: IDurationWithAxisIndex,
): IDurationWithAxisIndex {
  const {
    maxJerk,
    distance,
  } = multiAxisMovement[axisIndex];

  const initialJerkNormalized: number = maxJerk / Math.abs(distance);

  const length: number = multiAxisMovement.length;

  for (let i = 0; i < length; i++) {
    const {
      maxAcceleration,
      maxVelocity,
      distance,
    } = multiAxisMovement[i];

    const initialJerk: number = initialJerkNormalized * Math.abs(distance);

    const singleAxisDurationToReachMaxVelocityAtMaxJerk: number = Math.sqrt((2 * maxVelocity) / initialJerk);
    const singleAxisDurationToReachMaxAccelerationAtMaxJerk: number = maxAcceleration / initialJerk;

    const singleAxisDurationToReachMaxAccelerationOrMaxVelocityAtMaxJerk: number = Math.min(
      singleAxisDurationToReachMaxVelocityAtMaxJerk,
      singleAxisDurationToReachMaxAccelerationAtMaxJerk,
    );

    if (singleAxisDurationToReachMaxAccelerationOrMaxVelocityAtMaxJerk < duration) {
      axisIndex = i;
      duration = singleAxisDurationToReachMaxAccelerationOrMaxVelocityAtMaxJerk;
    }
  }

  return {
    duration,
    axisIndex,
  };
}

function computeMultiAxisMovementJerkDuration(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  distanceRatio: number,
): IDurationWithAxisIndex {
  return computeMultiAxisMovementJerkDurationToReachMaxAccelerationOrMaxVelocityOrDistanceAtMaxJerk(
    multiAxisMovement,
    computeMultiAxisMovementJerkDurationToReachDistanceAtMaxJerk(
      multiAxisMovement,
      distanceRatio,
    ),
  );
}

/* ACCELERATION */

function computeMultiAxisMovementAccelerationDurationToReachDistanceAtMaxAcceleration(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  distanceRatio: number,
  initialAccelerationNormalized: number, // if 0 => maxAcceleration
  initialVelocityNormalized: number,
): IDurationWithAxisIndex {
  const length: number = multiAxisMovement.length;

  // duration to reach distance at maxAcceleration
  let duration: number = 0;
  let axisIndex: number = -1;

  for (let i = 0; i < length; i++) {
    const {
      maxAcceleration,
      distance,
    } = multiAxisMovement[i];

    const _distance: number = Math.abs(distance);

    const initialAcceleration: number = (initialAccelerationNormalized === 0)
      ? maxAcceleration
      : (initialAccelerationNormalized * _distance);

    const initialVelocity: number = initialVelocityNormalized * _distance;

    const singleAxisDurationToReachDistance: number = (Math.sqrt((initialVelocity ** 2) + (2 * initialAcceleration * _distance * distanceRatio)) - initialVelocity)
      / initialAcceleration;

    if (singleAxisDurationToReachDistance > duration) {
      axisIndex = i;
      duration = singleAxisDurationToReachDistance;
    }
  }

  return {
    duration,
    axisIndex,
  };
}

function computeMultiAxisMovementAccelerationDurationToReachMaxVelocityOrDistanceAtMaxJerk(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  {
    duration,
    axisIndex,
  }: IDurationWithAxisIndex,
  initialAccelerationNormalized: number,
): IDurationWithAxisIndex {
  if (initialAccelerationNormalized === 0) {
    const {
      maxAcceleration,
      distance,
    } = multiAxisMovement[axisIndex];

    initialAccelerationNormalized = maxAcceleration / Math.abs(distance);
  }

  const length: number = multiAxisMovement.length;

  for (let i = 0; i < length; i++) {
    const {
      maxVelocity,
      distance,
    } = multiAxisMovement[i];

    const initialAcceleration: number = initialAccelerationNormalized * Math.abs(distance);

    const singleAxisDurationToReachMaxVelocityAtMaxAcceleration: number = maxVelocity / initialAcceleration;

    if (singleAxisDurationToReachMaxVelocityAtMaxAcceleration < duration) {
      axisIndex = i;
      duration = singleAxisDurationToReachMaxVelocityAtMaxAcceleration;
    }
  }

  return {
    duration,
    axisIndex,
  };
}

function computeMultiAxisMovementAccelerationDuration(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  distanceRatio: number,
  initialAccelerationNormalized: number,
  initialVelocityNormalized: number,
): IDurationWithAxisIndex {
  return computeMultiAxisMovementAccelerationDurationToReachMaxVelocityOrDistanceAtMaxJerk(
    multiAxisMovement,
    computeMultiAxisMovementAccelerationDurationToReachDistanceAtMaxAcceleration(
      multiAxisMovement,
      distanceRatio,
      initialAccelerationNormalized,
      initialVelocityNormalized,
    ),
    initialAccelerationNormalized,
  );
}


/* DECOMPOSE */

interface IDecomposeConstraint {
  minimalDuration?: number;
  // minimalDistance?: number;
}

function decomposeConstrainedMultiAxisMovement(
  multiAxisMovement: IConstrainedMultiAxisMovement,
  {
    minimalDuration = 0,
    // minimalDistance = 0,
  }: IDecomposeConstraint = {},
): IMovement[] {
  if (multiAxisMovement.every(({distance}) => distance === 0)) {
    return [];
  }

  let distanceRatio: number = 0.5;

  // current values for the movement
  let acceleration: number = 0;
  let velocity: number = 0;

  let jerkMovementA: IMovement | undefined;
  let jerkMovementB: IMovement | undefined;

  let accelerationMovementA: IMovement | undefined;
  let accelerationMovementB: IMovement | undefined;

  let linearMovement: IMovement | undefined;

  {
    const { duration, axisIndex } = computeMultiAxisMovementJerkDuration(
      multiAxisMovement,
      distanceRatio,
    );

    if (axisIndex === -1) {
      console.log(multiAxisMovement);
      debugger;
    }

    // console.log('duration', duration);
    // console.log('axisIndex', axisIndex);

    if (duration >= minimalDuration) {
      const {
        maxJerk,
        distance,
      } = multiAxisMovement[axisIndex];

      const jerkDistance: number = ((maxJerk * (duration ** 3)) / 6);
      // console.log('jerkDistance', jerkDistance);

      if (jerkDistance > 0) {
        const initialJerkNormalized: number = maxJerk / jerkDistance;
        // console.log('initialJerkNormalized', initialJerkNormalized);

        const terminalAccelerationNormalized: number = (initialJerkNormalized * duration);
        const terminalVelocityNormalized: number = (initialJerkNormalized * (duration ** 2)) / 2;

        const jerkDistanceRatio: number = jerkDistance / Math.abs(distance); // percent of movement done
        const distances: number[] = multiAxisMovement.map(({ distance }: IConstrainedSingleAxisMovement): number => {
          return distance * jerkDistanceRatio;
        });

        jerkMovementA = {
          initialJerkNormalized: initialJerkNormalized,
          initialAccelerationNormalized: 0,
          initialVelocityNormalized: 0,
          distances,
        };

        jerkMovementB = {
          initialJerkNormalized: initialJerkNormalized,
          initialAccelerationNormalized: -terminalAccelerationNormalized,
          initialVelocityNormalized: terminalVelocityNormalized,
          distances,
        };

        // logMovementDetails(jerkMovementA);
        // logMovementDetails(jerkMovementB);

        acceleration = terminalAccelerationNormalized * jerkDistanceRatio;
        velocity = terminalVelocityNormalized * jerkDistanceRatio;

        distanceRatio = Math.max(0, distanceRatio - jerkDistanceRatio);
      }
    }
  }

  if (distanceRatio > EPSILON) {
    // console.log('distanceRatio', distanceRatio);
    // console.log('acceleration', acceleration, 'velocity', velocity);

    // if (jerkMovementA === void 0) {
    //   console.log(`No jerking`);
    // }

    const { duration, axisIndex } = computeMultiAxisMovementAccelerationDuration(
      multiAxisMovement,
      distanceRatio,
      acceleration,
      velocity,
    );

    if (axisIndex === -1) {
      console.log(multiAxisMovement);
      debugger;
    }
    // console.log('duration', duration, axisIndex);

    if (duration >= minimalDuration) {
      const {
        distance,
        maxAcceleration,
      } = multiAxisMovement[axisIndex];

      const _distance: number = Math.abs(distance);

      const initialAcceleration: number = (jerkMovementA === void 0)
        ? maxAcceleration
        : (acceleration * _distance);

      const initialVelocity: number = (jerkMovementA === void 0)
        ? 0
        : (velocity * _distance);

      const accelerationDistance: number = ((initialAcceleration * (duration ** 2)) / 2) + (initialVelocity * duration);
      // console.log('accelerationDistance', accelerationDistance);

      if (accelerationDistance > 0) {
        const initialAccelerationNormalized: number = initialAcceleration / accelerationDistance;
        const initialVelocityNormalized: number = initialVelocity / accelerationDistance;
        // console.log('duration', duration);

        const terminalVelocityNormalized: number = (initialAccelerationNormalized * duration) + initialVelocityNormalized;

        const accelerationDistanceRatio: number = accelerationDistance / _distance; // percent of movement done
        const distances: number[] = multiAxisMovement.map(({ distance }: IConstrainedSingleAxisMovement): number => {
          return distance * accelerationDistanceRatio;
        });

        accelerationMovementA = {
          initialJerkNormalized: 0,
          initialAccelerationNormalized: initialAccelerationNormalized,
          initialVelocityNormalized: initialVelocityNormalized,
          distances,
        };

        accelerationMovementB = {
          initialJerkNormalized: 0,
          initialAccelerationNormalized: -initialAccelerationNormalized,
          initialVelocityNormalized: terminalVelocityNormalized,
          distances,
        };

        // logMovementDetails(accelerationMovementA);
        // logMovementDetails(accelerationMovementB);

        velocity = terminalVelocityNormalized * accelerationDistanceRatio;

        distanceRatio = Math.max(0, distanceRatio - accelerationDistanceRatio);
      }
    }
  }

  if (distanceRatio > EPSILON) {
    const linearDistanceRatio: number = distanceRatio * 2; // percent of movement done
    const distances: number[] = multiAxisMovement.map(({ distance }: IConstrainedSingleAxisMovement): number => {
      return distance * linearDistanceRatio;
    });

    linearMovement = {
      initialJerkNormalized: 0,
      initialAccelerationNormalized: 0,
      initialVelocityNormalized: velocity,
      distances,
    };

    // logMovementDetails(linearMovement);
  }

  const movements: IMovement[] = [];

  if (jerkMovementA !== void 0) {
    movements.push(jerkMovementA);
  }

  if (accelerationMovementA !== void 0) {
    movements.push(accelerationMovementA);
  }

  if (linearMovement !== void 0) {
    movements.push(linearMovement);
  }

  if (accelerationMovementB !== void 0) {
    movements.push(accelerationMovementB);
  }

  if (jerkMovementB !== void 0) {
    movements.push(jerkMovementB);
  }

  return movements;

}


function decomposeConstrainedMultiAxisMovements(
  multiAxisMovements: IConstrainedMultiAxisMovement[],
  options?: IDecomposeConstraint,
): IMovement[] {
  return multiAxisMovements.reduce((movements: IMovement[], multiAxisMovement: IConstrainedMultiAxisMovement): IMovement[] => {
    return movements.concat(decomposeConstrainedMultiAxisMovement(multiAxisMovement, options));
  }, []);
}

/*-----------------*/

type I2DCoordinates = [x: number, y: number];

function arc2D(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  angle: number,
  steps: number,
): I2DCoordinates[] {
  return Array.from({ length: (steps + 1) }, (_, i: number): [number, number] => {
    const s: number = i / steps;
    const a: number = startAngle + angle * s;
    const _x: number = x + Math.cos(a) * radius;
    const _y: number = y + Math.sin(a) * radius;
    return [
      _x,
      _y,
    ];
  });
}

function circle2D(
  x: number,
  y: number,
  radius: number,
  steps: number,
): I2DCoordinates[] {
  return arc2D(
    x,
    y,
    radius,
    0,
    Math.PI * 2,
    steps,
  );
}


function rectangle2D(
  x: number,
  y: number,
  width: number,
  height: number,
): I2DCoordinates[] {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
    [x, y],
  ];
}

function square2D(
  x: number,
  y: number,
  side: number,
): I2DCoordinates[] {
  return rectangle2D(x, y, side, side);
}

function coordinatesToIConstrainedMultiAxisMovement(
  coordinates: I2DCoordinates[],
  xConstraint: IMovementConstraint,
  yConstraint: IMovementConstraint,
): IConstrainedMultiAxisMovement[] {
  let _x: number = 0;
  let _y: number = 0;

  return coordinates.map(([x, y]: I2DCoordinates): IConstrainedMultiAxisMovement => {
    const __x: number = x - _x;
    const __y: number = y - _y;
    _x = x;
    _y = y;

    return [
      {
        distance: __x,
        ...xConstraint,
      },
      {
        distance: __y,
        ...yConstraint,
      },
    ] as IConstrainedMultiAxisMovement;
  });
}

/*-----------------*/

/*
TODO:
  the current minimalDuration is not optimal:
  - we should start at the velocity and acceleration of the jerkMovement
 */

export function debugMovement1() {
  // const axeAConstraint: IMovementConstraint = {
  //   maxVelocity: 10,
  //   // maxAcceleration: 1e3,
  //   maxAcceleration: 2,
  //   maxJerk: 1,
  // };
  //
  // const axeBConstraint: IMovementConstraint = {
  //   maxVelocity: 10,
  //   maxAcceleration: 1,
  //   maxJerk: 10,
  // };
  //
  // // (10, 0)
  // const movementA: IConstrainedMultiAxisMovement = [
  //   {
  //     distance: -100,
  //     // distance: 0.00001,
  //     // distance: 2,
  //     ...axeAConstraint,
  //   },
  //   // {
  //   //   distance: 200.0000,
  //   //   ...axeBConstraint,
  //   // },
  // ];

  const axeAConstraint: IMovementConstraint = {
    maxVelocity: 100,
    maxAcceleration: 100,
    maxJerk: 100,
  };

  const axeBConstraint: IMovementConstraint = {
    maxVelocity: 100,
    maxAcceleration: 100,
    maxJerk: 100,
  };

  // (10, 0)
  const movementA: IConstrainedMultiAxisMovement = [
    {
      distance: -0.19732715717285032,
      ...axeAConstraint,
    },
    {
      distance: 6.279051952931337,
      ...axeBConstraint,
    },
  ];

  const movements = decomposeConstrainedMultiAxisMovement(
    movementA,
  );

  movements.forEach((movement: IMovement, index: number): void => {
    console.log(`\nmovement #${index}`);
    logMovementDetails(movement);
  });

  // renderMovements(movements);
}

export function debugMovement2() {
  const axeAConstraint: IMovementConstraint = {
    maxVelocity: 1e9,
    maxAcceleration: 1e3,
    maxJerk: 1e9,
  };

  const axeBConstraint: IMovementConstraint = {
    ...axeAConstraint,
    // maxVelocity: 100,
    // maxAcceleration: 100,
    // maxJerk: 100,
  };

  // const coordinates: I2DCoordinates[] = circle2D(0, 0, 100, 100);
  const coordinates: I2DCoordinates[] = square2D(0, 0, 100);

  const constrainedMovements = coordinatesToIConstrainedMultiAxisMovement(
    coordinates,
    axeAConstraint,
    axeBConstraint,
  );

  // console.log(constrainedMovements);

  const movements: IMovement[] = decomposeConstrainedMultiAxisMovements(constrainedMovements);

  console.log(movements);

  renderMovements(movements);
}

export function debugMovementRenderer1() {
  const renderer = new CanvasMovementRenderer(createContext(512));

  renderer.ctx.canvas.style.backgroundColor = 'black';

  renderer.ctx.translate(256, 256);

  renderer.stepper.queueMovement({
    initialJerkNormalized: 0,
    initialAccelerationNormalized: 0.1,
    initialVelocityNormalized: 0,
    distances: [100, 200],
  });

  renderer.stepper.queueMovement({
    initialJerkNormalized: 0,
    initialAccelerationNormalized: 0.1,
    initialVelocityNormalized: 0,
    distances: [100, -200],
  });

  (window as any).stop = renderer.start();
}


/*---*/

export function debugMovement() {
  // debugMovement1();
  debugMovement2();
  // debugMovementRenderer1();
}

