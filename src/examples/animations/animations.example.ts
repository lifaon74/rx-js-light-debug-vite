/** CONSTANTS **/
import { parseCSSAngle } from '../misc/css/quantities/angle/parse-css-angle';
import { parseCSSAbsoluteLengthOrThrow } from '../misc/css/quantities/length/parse-css-absolute-length';


// export const ANIMATION_START = Number.NEGATIVE_INFINITY;
// export const ANIMATION_END = Number.POSITIVE_INFINITY;

export const ANIMATION_START_FLAG = Symbol('ANIMATION_START');
export const ANIMATION_END_FLAG = Symbol('ANIMATION_END');


export type IProgress = number; // usually [0, 1]

export type IProgressWithFlags =
  IProgress
  | typeof ANIMATION_START_FLAG
  | typeof ANIMATION_END_FLAG
  ;

/** PROGRESS FUNCTION **/

export interface IProgressFunction {
  (progress: IProgress): IProgress;
}


export function linear(): IProgressFunction {
  return (progress: IProgress): IProgress => {
    return progress;
  };
}

export function scale(
  scaling: number,
): IProgressFunction {
  return (progress: IProgress): IProgress => {
    return progress * scaling;
  };
}


/** PROGRESSING VALUE FUNCTION **/


export interface IProgressingValueFunction<GValue> {
  (progress: IProgress): GValue;
}


export function numberFromTo(
  from: number,
  to: number,
): IProgressingValueFunction<number> {
  const range: number = to - from;
  return (
    progress: IProgress,
  ): number => {
    return from + (progress * range);
  };
}

export function map<GIn, GOut>(
  progressingValueFunction: IProgressingValueFunction<GIn>,
  mapFunction: (value: GIn) => GOut,
): IProgressingValueFunction<GOut> {
  return (
    progress: IProgress,
  ): GOut => {
    return mapFunction(progressingValueFunction(progress));
  };
}


export function mapToPx(
  progressingValueFunction: IProgressingValueFunction<number>,
): IProgressingValueFunction<string> {
  return map(progressingValueFunction, (value: number): string => {
    return `${value}px`;
  });
}

export function pxFromTo(
  from: number,
  to: number,
): IProgressingValueFunction<string> {
  return mapToPx(numberFromTo(from, to));
}


export interface IAnimateElementFunction {
  (
    element: HTMLElement,
    progress: IProgress,
  ): void;
}


export interface IAnimateElementFunctionWithFlagsSupport {
  (
    element: HTMLElement,
    progress: IProgressWithFlags,
  ): void;
}

// export function animateElementFunctionWithStartAndEndAnimationSupport(
//   animateElementFunction: IAnimateElementFunction,
// ): IAnimateElementFunctionWithStartAndEndAnimationSupport {
//   return (
//     element: HTMLElement,
//     progress: IProgressWithFlags,
//   ): void => {
//     if (
//       (progress !== ANIMATION_START_FLAG)
//       && (progress !== ANIMATION_END_FLAG)
//     ) {
//       animateElementFunction(element, progress);
//     }
//   };
// }



export type IProgressingStylePropertyFunction = IProgressingValueFunction<string>;

export function animateStyleProperty(
  propertyName: string,
  progressingValue: IProgressingStylePropertyFunction,
): IAnimateElementFunctionWithFlagsSupport {
  return (
    element: HTMLElement,
    progress: IProgressWithFlags,
  ): void => {
    if (
      (progress !== ANIMATION_START_FLAG)
      && (progress !== ANIMATION_END_FLAG)
    ) {
      element.style.setProperty(propertyName, progressingValue(progress));
    }
  };
}

// export function animateStyleProperty(
//   propertyName: string,
//   progressingValue: IProgressingStylePropertyFunction,
// ): IAnimateElementFunction {
//   return (
//     element: HTMLElement,
//     progress: IProgress,
//   ): void => {
//     element.style.setProperty(propertyName, progressingValue(progress));
//   };
// }


export type IProgressingScrollFunction = IProgressingValueFunction<number>;

export function animateScrollTop(
  progressingValue: IProgressingScrollFunction,
): IAnimateElementFunction {
  return (
    element: HTMLElement,
    progress: IProgress,
  ): void => {
    element.scrollTop = progressingValue(progress);
  };
}


export function animateHeightPropertyWithAutoAtStart(
  to: number,
): IAnimateElementFunctionWithFlagsSupport {
  return animateFromOtherToPxStyleProperty('height', 'auto', to);
}


export function animateHeightPropertyWithAutoAtEnd(
  from: number,
): IAnimateElementFunctionWithFlagsSupport {
  return animateFromPxToOtherStyleProperty('height', from, 'auto');
}

export function animateFromPxToOtherStyleProperty(
  propertyName: string,
  fromPx: number,
  toOther: string,
): IAnimateElementFunctionWithFlagsSupport {
  let progressingValue: IProgressingStylePropertyFunction;

  return (
    element: HTMLElement,
    progress: IProgressWithFlags,
  ): void => {
    let propertyValue: string;

    if (progress === ANIMATION_START_FLAG) {
      element.style.setProperty(propertyName, toOther, 'important');
      const toPx: number = parseCSSAbsoluteLengthOrThrow(getComputedStyle(element).getPropertyValue(propertyName));
      progressingValue = pxFromTo(fromPx, toPx);
      propertyValue = progressingValue(0);
    } else if (progress === ANIMATION_END_FLAG) {
      propertyValue = toOther;
    } else {
      propertyValue = progressingValue(progress);
    }

    element.style.setProperty(propertyName, propertyValue);
  };
}


export function animateFromOtherToPxStyleProperty(
  propertyName: string,
  fromOther: string,
  toPx: number,
): IAnimateElementFunctionWithFlagsSupport {
  let progressingValue: IProgressingStylePropertyFunction;

  return (
    element: HTMLElement,
    progress: IProgressWithFlags,
  ): void => {
    let propertyValue: string;

    if (progress === ANIMATION_START_FLAG) {
      element.style.setProperty(propertyName, fromOther, 'important');
      const fromPx: number = parseCSSAbsoluteLengthOrThrow(getComputedStyle(element).getPropertyValue(propertyName));
      progressingValue = pxFromTo(fromPx, toPx);
      propertyValue = fromOther;
    } else if (progress === ANIMATION_END_FLAG) {
      propertyValue = progressingValue(1);
    } else {
      propertyValue = progressingValue(progress);
    }

    element.style.setProperty(propertyName, propertyValue);
  };
}

export function groupElementAnimations(
  ...animations: IAnimateElementFunctionWithFlagsSupport[]
): IAnimateElementFunctionWithFlagsSupport {
  return (
    element: HTMLElement,
    progress: IProgressWithFlags,
  ): void => {
    for (let i = 0, l = animations.length; i < l; i++) {
      animations[i](element, progress);
    }
  };
}


export interface IAnimateFunction {
  (
    progress: IProgressWithFlags,
  ): void;
}

export function animate(
  animateFunction: IAnimateFunction,
  duration: number,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: void | PromiseLike<void>) => void,
  ): void => {
    const startTime: number = Date.now();
    let started: boolean = false;

    const loop = () => {
      requestAnimationFrame(() => {
        if (!started) {
          started = true;
          animateFunction(ANIMATION_START_FLAG);
        }
        const progress: number = Math.min((Date.now() - startTime) / duration, 1);
        animateFunction(progress);
        if (progress === 1) {
          animateFunction(ANIMATION_END_FLAG);
          resolve();
        } else {
          loop();
        }
      });
    };

    loop();
  });
}


/*-------------*/

function dummy(
  name: string = '',
) {
  const element = document.createElement('pre');
  element.style.width = '100px';
  element.style.height = '100px';
  element.style.backgroundColor = 'blue';
  element.style.fontSize = '18px';
  element.style.padding = '10px';
  element.style.color = 'white';
  element.innerText = name;
  document.body.appendChild(element);
  return element;
}


export function animationsExample() {
  const element = dummy('dummy-1\n2');

  const translateX = map(numberFromTo(10, 300), _ => `translateX(${_}px)`);
  const transformAnimation = animateStyleProperty('transform', translateX);

  // const height = pxFromTo(100, 200);
  // const heightAnimation = animateStyleProperty('height', height);
  // const heightAnimation = animateHeightPropertyWithAutoAtStart(200);
  const heightAnimation = animateHeightPropertyWithAutoAtEnd(20);

  const animation = groupElementAnimations(
    transformAnimation,
    heightAnimation,
  );
  // animation(element, 0.5);

  animate((progress: IProgressWithFlags): void => {
    animation(element, progress);
  }, 3000);
  // console.log(numberFromTo(10, 20)(0.5));
  // console.log(numberFromTo(20, 10)(0.5));
}
