import { IMovement } from './movement.types';

function cubeRoot(
  x: number,
): number {
  return Math.cbrt(x);
  // const y: number = Math.pow(Math.abs(x), 1 / 3);
  // return (x < 0)
  //   ? -y
  //   : y;
}

const EPSILON: number = 1e-8;

// https://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically

export function solveCubic(
  a: number,
  b: number,
  c: number,
  d: number,
): number[] {
  if (Math.abs(a) < EPSILON) { // Quadratic case, ax^2+bx+c=0
    a = b;
    b = c;
    c = d;

    if (Math.abs(a) < EPSILON) { // Linear case, ax+b=0
      a = b;
      b = c;

      return (Math.abs(a) < EPSILON)// Degenerate case
        ? []
        : [-b / a];
    }

    const D: number = b * b - 4 * a * c;

    if (Math.abs(D) < EPSILON) {
      return [-b / (2 * a)];
    } else if (D > 0) {
      return [
        (-b + Math.sqrt(D)) / (2 * a),
        (-b - Math.sqrt(D)) / (2 * a),
      ];
    } else {
      return [];
    }
  }

  // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
  const p: number = (3 * a * c - b * b) / (3 * a * a);
  const q: number = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots: number[];

  if (Math.abs(p) < EPSILON) { // p = 0 -> t^3 = -q -> t = -q^1/3
    roots = [cubeRoot(-q)];
  } else if (Math.abs(q) < EPSILON) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    const D: number = q * q / 4 + p * p * p / 27;
    if (Math.abs(D) < EPSILON) {       // D = 0 -> two roots
      roots = [-1.5 * q / p, 3 * q / p];
    } else if (D > 0) {             // Only one real root
      const u: number = cubeRoot(-q / 2 - Math.sqrt(D));
      roots = [u - p / (3 * u)];
    } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
      const u: number = 2 * Math.sqrt(-p / 3);
      const t: number = Math.acos(3 * q / p / u) / 3;  // D < 0 implies p < 0 and acos argument in [-1..1]
      const k: number = 2 * Math.PI / 3;

      roots = [
        u * Math.cos(t),
        u * Math.cos(t - k),
        u * Math.cos(t - 2 * k),
      ];
    }
  }

  // Convert back from depressed cubic
  for (let i = 0; i < roots.length; i++) {
    roots[i] -= b / (3 * a);
  }

  return roots;
}


export function getMovementDuration(
  {
    initialJerkNormalized,
    initialAccelerationNormalized,
    initialVelocityNormalized,
  }: Omit<IMovement, 'distances'>,
): number {
  const durations: number[] = solveCubic(
    initialJerkNormalized / 6,
    initialAccelerationNormalized / 2,
    initialVelocityNormalized,
    -1,
  );

  let _duration: number = Number.POSITIVE_INFINITY;
  for (let i = 0, l = durations.length; i < l; i++) {
    const duration: number = durations[i];
    if ((duration >= 0) && (duration < _duration)) {
      _duration = duration;
    }
  }

  // console.log(`durations: ${durations.join(', ')} -> ${ duration }`);

  return _duration;
}
