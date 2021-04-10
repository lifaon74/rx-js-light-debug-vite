import { createMulticastReplayLastSource, of, reactiveFunction, reactiveTemplateString } from '@lifaon/rx-js-light';

/** MIN - MAX EXAMPLE **/

function minMaxWithoutObservable() {
  let value = 0;
  const min = 0; // constant
  const max = 10;

  const isValid = (): boolean => {
    return (min <= value) && (value <= max);
  };

  const onValidityChange = (valid: boolean): void => {
    console.log(valid ? 'valid' : 'invalid');
  };

  const updateValue = (_value: number): void => {
    value = _value;
    onValidityChange(isValid());
  };

  updateValue(0);
  updateValue(5);
  updateValue(15);

  // if someone does value = X somewhere instead of updateValue(X), the app enters into in incoherent state
}

function minMaxWithObservable() {
  const $value$ = createMulticastReplayLastSource({ initialValue: 0 }); // mutable
  const min$ = of(0); // constant
  const max$ = of(10); // constant

  const isValid$ = reactiveFunction((min: number, max: number, value: number): boolean => {
    return (min <= value) && (value <= max);
  }, [min$, max$, $value$.subscribe]);

  isValid$((valid: boolean) => {
    console.log(valid ? 'valid' : 'invalid');
  });
  // immediately logs 'valid' because value is a MulticastReplayLastSource with an initial value of 0

  $value$.emit(5); // 'valid'
  $value$.emit(15); // 'invalid'
}


/*-------------*/

export function reactiveVariableMinMaxExample() {
  // minMaxWithoutObservable();
  minMaxWithObservable();
}

