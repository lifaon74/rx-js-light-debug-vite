
export interface IMovementConstraint {
  maxJerk: number; // (R++)
  maxAcceleration: number; // (R++)
  maxVelocity: number; // (R++)
}

export interface IConstrainedSingleAxisMovement extends IMovementConstraint {
  distance: number;
}

export type IConstrainedMultiAxisMovement = IConstrainedSingleAxisMovement[];

export interface IMovement {
  initialJerkNormalized: number; // normalized
  initialAccelerationNormalized: number; // normalized
  initialVelocityNormalized: number;  // normalized
  distances: number[];
}


// SPI: 4Mhz => 500KB/s
// encoded as [jerk: float32, acceleration: float32, velocity: float32, distance: int24] => 15 Bytes => 33K movements/s
// encoded as [duration: float32, jerk: float32, acceleration: float32, velocity: float32, distance: int24] => 19Bytes => 26K movements/s

