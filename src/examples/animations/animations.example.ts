
/** CONSTANTS **/

export const ANIMATION_START = Number.NEGATIVE_INFINITY;
export const ANIMATION_END = Number.POSITIVE_INFINITY;

export type IProgress = number; // usually [0, 1]

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


export type IProgressingStylePropertyFunction = IProgressingValueFunction<string>;

export function animateStyleProperty(
  propertyName: string,
  progressingValue: IProgressingStylePropertyFunction,
): IAnimateElementFunction {
  return (
    element: HTMLElement,
    progress: IProgress,
  ): void => {
    element.style.setProperty(propertyName, progressingValue(progress));
  };
}

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


export function groupElementAnimations(
  ...animations: IAnimateElementFunction[]
) {
  return (
    element: HTMLElement,
    progress: IProgress,
  ): void => {
    for (let i = 0, l = animations.length; i < l; i++) {
      animations[i](element, progress);
    }
  };
}


export interface IAnimateFunction {
  (
    progress: IProgress,
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

    const loop = () => {
      requestAnimationFrame(() => {
        const progress: number = Math.min((Date.now() - startTime) / duration, 1);
        animateFunction(progress);
        if (progress === 1) {
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

  const height = pxFromTo(100, 200);
  const heightAnimation = animateStyleProperty('height', height);

  const animation = groupElementAnimations(
    transformAnimation,
    heightAnimation,
  );
  // animation(element, 0.5);

  animate((progress: IProgress): void => {
    animation(element, progress);
  }, 3000);
  // console.log(numberFromTo(10, 20)(0.5));
  // console.log(numberFromTo(20, 10)(0.5));
}
