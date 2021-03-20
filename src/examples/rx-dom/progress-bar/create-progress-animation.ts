export function createProgressAnimation(
  element: HTMLElement & { progress: number },
) {
  const loop = () => {
    element.progress = (element.progress + 0.01 * Math.random()) % 1;
    // setAttributeValueWithEvent(element, 'progress', String((element.progress + 0.01 * Math.random()) % 1));
    setTimeout(loop, 100);
  };
  loop();
}

