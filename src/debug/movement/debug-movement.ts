

/*
(1) a = a
(2) v = a * t + vi
(3) d = 1/2 * a * t² + vi * t + di

(3) -> (4): compute t
delta = vi² - (2 * a * (di - d))
(4) t = (-vi +- sqrt(delta)) / a

(3) -> (5): compute a
    a = (d - (vi * t) - di) / (1/2 * t²)
(5) a = ((d - di) - (vi * t)) / (1/2 * t²)
(5') a = (((d - di) - (vi * t)) * 2) / t²


--

a² * x + b* x + c = 0
d = b² - 4 * a * c
y = (-b +- sqrt(d)) / 2a

--

R = Reals = ]-∞, +∞[
R+ = Positive Reals = [0, +∞[

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


function compteTimeToPerformMovement(
  a: number, // [0, Infinity[
  vi: number, // [0, Infinity[
  d: number, // [0, Infinity[
): number {
  return (Math.sqrt((vi * vi) + (2 * a * d)) - vi) / a;
  // const delta: number = (vi ** 2) - (2 * a * d);
  // if (delta < 0) {
  //   throw new Error(`Cannot solve`);
  // } else {
  //   const t1: number = (-vi + Math.sqrt(delta)) / a;
  //   const t2: number = (-vi - Math.sqrt(delta)) / a;
  //   const t: number = Math.max(t1, t2);
  // }
}

function compteAccelerationToPerformMovement(
  t: number, // [0, Infinity[
  vi: number, // [0, Infinity[
  d: number, // [0, Infinity[
): number {
  return (d - vi * t) / (0.5 * t * t);
}

/*-----------------*/

interface ISingleAxisMovementConstraint {
  maxVelocity: number; // (R+)
  maxAcceleration: number; // (R+)
  maxJerk: number; // (R+)
}

interface ISingleAxisMovement extends ISingleAxisMovementConstraint {
  distance: number;
  initialVelocity: number;
}

type IMultiAxisMovement = ArrayLike<ISingleAxisMovement>;

type ITerminalVelocities = ArrayLike<number>;

function computeOptimalTransitionVelocity(
  movementA: IMultiAxisMovement,
  movementB: IMultiAxisMovement,
): number {
  const length: number = movementA.length;

  const transitionVelocities: number[]  = new Array<number>(length);
  const terminalVelocities = getTerminalVelocitiesToPerformMultiAxisMovement(movementA);
  const initialVelocities = getInitialVelocitiesToPerformMultiAxisMovement(movementB);

  console.log(terminalVelocities, initialVelocities);

  for (let i = 0; i < length; i++) {
    const maxJerkA: number = movementA[i].maxJerk;
    const maxJerkB: number = movementB[i].maxJerk;
    const terminalVelocity = terminalVelocities[i];
    const initialVelocity = initialVelocities[i];
    // transitionVelocities[i] = Math.min(terminalVelocity, initialVelocity + maxJerkA + maxJerkB);
    // if ()
    transitionVelocities[i] = Math.min(terminalVelocity, initialVelocity + maxJerkA + maxJerkB);
  }

  console.log(transitionVelocities);

  return -1;
}


function getTerminalVelocitiesToPerformMultiAxisMovement(
  movement: IMultiAxisMovement,
): ITerminalVelocities {
  const length: number = movement.length;
  const terminalVelocities: number[]  = new Array<number>(length);

  let maxTimeToTravelDistanceAtMaxAcceleration: number = 0;
  let minTimeToAchieveMaxVelocityAtMaxAcceleration: number = Number.POSITIVE_INFINITY;

  for (let i = 0; i < length; i++) {
    const {
      distance,
      initialVelocity,
      maxVelocity,
      maxAcceleration,
    }: ISingleAxisMovement = movement[i];

    const timeToAchieveMaxVelocityAtMaxAcceleration: number = (maxVelocity - initialVelocity) / maxAcceleration;
    const timeToTravelDistanceAtMaxAcceleration: number = (Math.sqrt((initialVelocity * initialVelocity) + (2 * maxAcceleration * Math.abs(distance))) - initialVelocity) / maxAcceleration;

    maxTimeToTravelDistanceAtMaxAcceleration = Math.max(
      maxTimeToTravelDistanceAtMaxAcceleration,
      timeToTravelDistanceAtMaxAcceleration,
    );

    minTimeToAchieveMaxVelocityAtMaxAcceleration = Math.min(
      minTimeToAchieveMaxVelocityAtMaxAcceleration,
      timeToAchieveMaxVelocityAtMaxAcceleration,
    );
  }

  const timeOfAcceleration: number = Math.min(maxTimeToTravelDistanceAtMaxAcceleration, minTimeToAchieveMaxVelocityAtMaxAcceleration);

  for (let i = 0; i < length; i++) {
    const {
      distance,
      initialVelocity,
      maxVelocity,
    }: ISingleAxisMovement = movement[i];
    // (5') a = (((d - di) - (vi * t)) * 2) / t²
    // (2) vt = a * t + vi
    // vt = (((d - (vi * t)) * 2) / t²) * t + vi
    // vt = (((d - (vi * t)) * 2) / t) + vi
    terminalVelocities[i] = Math.min(
      (((distance - (initialVelocity * timeOfAcceleration )) * 2) / timeOfAcceleration) + initialVelocity,
      maxVelocity,
    );
  }

  return terminalVelocities;
}


function getInitialVelocitiesToPerformMultiAxisMovement(
  movement: IMultiAxisMovement,
): ITerminalVelocities {
  const length: number = movement.length;
  const initialVelocities: number[]  = new Array<number>(length);

  let maxTimeToTravelDistanceAtMaxVelocity: number = 0;

  for (let i = 0; i < length; i++) {
    const {
      distance,
      maxVelocity,
    }: ISingleAxisMovement = movement[i];

    // (3) d = vi * t <=> t = d / vi
    const timeToTravelDistanceAtMaxVelocity: number = Math.abs(distance) / maxVelocity;

    maxTimeToTravelDistanceAtMaxVelocity = Math.max(
      maxTimeToTravelDistanceAtMaxVelocity,
      timeToTravelDistanceAtMaxVelocity,
    );
  }

  for (let i = 0; i < length; i++) {
    const {
      distance,
    }: ISingleAxisMovement = movement[i];
    // (3) d = vi * t <=> vi = d / t
    initialVelocities[i] = distance / maxTimeToTravelDistanceAtMaxVelocity;
  }

  return initialVelocities;
}

/*-----------------*/



export function debugMovement() {
  const axeAConstraint: ISingleAxisMovementConstraint = {
    maxVelocity: 10,
    maxAcceleration: 1,
    maxJerk: 0.1,
  };

  const axeBConstraint: ISingleAxisMovementConstraint = {
    maxVelocity: 10,
    maxAcceleration: 1,
    maxJerk: 0.1,
  };

  // linear movement (pure X)
  const movementA: IMultiAxisMovement = [
    {
      distance: 10,
      initialVelocity: 0,
      ...axeAConstraint,
    },
    {
      distance: 0,
      initialVelocity: 0,
      ...axeBConstraint,
    }
  ];

  const movementB: IMultiAxisMovement = [
    {
      distance: 10,
      initialVelocity: 0,
      ...axeAConstraint,
    },
    {
      distance: 10,
      initialVelocity: 0,
      ...axeBConstraint,
    }
  ];

  // right angle movement (pure X, the  pure Y)
  // const movementA: IMultiAxisMovement = [
  //   {
  //     distance: 10,
  //     initialVelocity: 0,
  //     ...axeAConstraint,
  //   },
  //   {
  //     distance: 0,
  //     initialVelocity: 0,
  //     ...axeBConstraint,
  //   }
  // ];
  //
  // const movementB: IMultiAxisMovement = [
  //   {
  //     distance: 0,
  //     initialVelocity: 0,
  //     ...axeAConstraint,
  //   },
  //   {
  //     distance: 10,
  //     initialVelocity: 0,
  //     ...axeBConstraint,
  //   }
  // ];

  // const movementA: IMultiAxisMovement = [
  //   {
  //     distance: 10,
  //     initialVelocity: 0,
  //     ...axeAConstraint,
  //   },
  //   {
  //     distance: -10,
  //     initialVelocity: 0,
  //     ...axeBConstraint,
  //   }
  // ];
  //
  // const movementB: IMultiAxisMovement = [
  //   {
  //     distance: 10,
  //     initialVelocity: 0,
  //     ...axeAConstraint,
  //   },
  //   {
  //     distance: 10,
  //     initialVelocity: 0,
  //     ...axeBConstraint,
  //   }
  // ];

  computeOptimalTransitionVelocity(
    movementA,
    movementB,
  );
}

