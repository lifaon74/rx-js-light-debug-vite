import { bootstrap } from '@lifaon/rx-dom';
import { const$$ } from '@lifaon/rx-js-light-shortcuts';
import { AppNumberInputComponent } from './number/number-input.component';


/** DEBUG **/

function formControlDebug1() {
  const input = new AppNumberInputComponent();
  bootstrap(input);

  input.required$ = const$$(true);
  input.min$ = const$$(5);
  // input.required = true;

  input.validity.valid$((value: boolean) => {
    console.log('valid$', value);
  });

  (window as any).input = input;
  (window as any).const$$ = const$$;
}


/*-------------*/

export function formControlDebug() {
  formControlDebug1();
}

