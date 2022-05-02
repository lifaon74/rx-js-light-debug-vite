import { andM$$, IObservable, single } from '@lirx/core';
import { maxWidthWithAspectRatioElement } from './conditions/size/element/max-width-with-aspect-ratioelement';
import { picture$$ } from './src/observables/picture-observable';
import { src$$ } from './src/observables/src-observable';
import { PictureComponent } from './component/picture.component';
import { bootstrap } from '@lirx/dom';

/*---------------------*/


/*----------*/

// export function makePictureElement<GElement extends HTMLElement>(
//   element: GElement,
// ): GElement {
//   element.style.setProperty('background-repeat', 'no-repeat');
//   element.style.setProperty('background-position', 'center center');
//   element.style.setProperty('background-size', 'contain');
//   return element;
// }
//
// export function withBackgroundImage<GElement extends HTMLElement>(
//   element: GElement,
// ): GElement {
//   element.style.setProperty('background-repeat', 'no-repeat');
//   element.style.setProperty('background-position', 'center center');
//   element.style.setProperty('background-size', 'contain');
//   return element;
// }
//
// export function withAspectRatio<GElement extends HTMLElement>(
//   element: GElement,
//   aspectRatio: number,
// ): GElement {
//   element.style.setProperty('width', '100%');
//   element.style.setProperty('aspect-ratio', `${aspectRatio} / 1`);
//   return element;
// }
//
// export function createPictureElement(): HTMLDivElement {
//   return makePictureElement(document.createElement('div'));
// }

/*---------------------*/

const aspectRatio: number = 3670 / 2462;

function getPictureSource(
  container: HTMLElement,
): IObservable<string> {
  const maxWidth = (width: number): IObservable<boolean> => {
    return maxWidthWithAspectRatioElement(container, width, aspectRatio);
  };

  const root: string = '/assets/images/dynamic';

  const src100$ = src$$(`${root}/sample-100.jpg`);
  const src100Condition$ = andM$$(maxWidth(100));
  const source500$ = src$$(`${root}/sample-500.jpg`);
  const src500Condition$ = andM$$(maxWidth(500));
  const source1000$ = src$$(`${root}/sample-1000.jpg`);
  const src1000Condition$ = andM$$(maxWidth(1000));
  const source2000$ = src$$(`${root}/sample-2000.jpg`);
  const src2000Condition$ = andM$$(maxWidth(2000));
  const sourceNative$ = src$$(`${root}/sample-native.jpg`);
  const srcNativeCondition$ = single(true);

  return picture$$([
    [src100$, src100Condition$],
    [source500$, src500Condition$],
    [source1000$, src1000Condition$],
    [source2000$, src2000Condition$],
    [sourceNative$, srcNativeCondition$],
  ]);

}

function pictureExample1() {

  const container = document.createElement('div');


  document.body.appendChild(container);

  // container.style.setProperty('width', '500px');
  // container.style.setProperty('height', '500px');

  container.style.setProperty('width', '100%');
  // container.style.setProperty('height', '100%');
  container.style.setProperty('aspect-ratio', `${aspectRatio} / 1`);

  container.style.setProperty('background-repeat', 'no-repeat');
  container.style.setProperty('background-position', 'center center');
  container.style.setProperty('background-size', 'contain');


  /*-------*/

  const picture$ = getPictureSource(container);

  picture$((src: string) => {
    container.style.setProperty('background-image', `url(${src})`);
  });
}


function pictureExample2() {
  const pictureElement = new PictureComponent();
  pictureElement.style.setProperty('aspect-ratio', `${aspectRatio} / 1`);
  pictureElement.src$ = getPictureSource(pictureElement);
  bootstrap(pictureElement);
}


/*---------------------*/

export function pictureExample() {
  // pictureExample1();
  pictureExample2();
}
