import {
  fromEventTarget, function$$, interval, IObservable, map$$, map$$$, merge, pipe$$, single,
} from '@lifaon/rx-js-light';
import { createLocaleFormatContext } from './shared-functions';
import { dateTimeFormatS$$$, ILocales } from '@lifaon/rx-i18n';

/*----------------------*/

/*

https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggTFJcblxuICAgIFNFTEVDVHt7IzEgPHNlbGVjdD46IGxpc3Qgb2YgbG9jYWxlcyA9PiBvbmNoYW5nZX19XG4gICAgTE9DQUxFKCMxLjEgPHNlbGVjdD4udmFsdWU6IHNlbGVjdGVkIGxvY2FsZSlcblxuICAgIElOVEVSVkFMe3sjMiBFdmVyeSBzZWNvbmR9fVxuICAgIFRJTUVTVEFNUCgjMi4xIEN1cnJlbnQgdGltZXN0YW1wKVxuXG4gICAgTUVSR0UoIzMgQ29udmVydCByZWNlaXZlZCBsb2NhbGUgYW5kIGRhdGUgaW50byBhIHN0cmluZylcblxuICAgIE9VVFBVVFtbRGlzcGxheSByZXN1bHRdXVxuXG4gICAgU0VMRUNULS0-TE9DQUxFXG4gICAgSU5URVJWQUwtLT5USU1FU1RBTVBcblxuICAgIExPQ0FMRS0tPk1FUkdFXG4gICAgVElNRVNUQU1QLS0-TUVSR0VcblxuICAgIE1FUkdFLS0-T1VUUFVUXG5cbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9

https://mermaid-js.github.io/mermaid-live-editor/view/#eyJjb2RlIjoiZ3JhcGggTFJcblxuICAgIFNFTEVDVHt7IzEgPHNlbGVjdD46IGxpc3Qgb2YgbG9jYWxlcyA9PiBvbmNoYW5nZX19XG4gICAgTE9DQUxFKCMxLjEgPHNlbGVjdD4udmFsdWU6IHNlbGVjdGVkIGxvY2FsZSlcblxuICAgIElOVEVSVkFMe3sjMiBFdmVyeSBzZWNvbmR9fVxuICAgIFRJTUVTVEFNUCgjMi4xIEN1cnJlbnQgdGltZXN0YW1wKVxuXG4gICAgTUVSR0UoIzMgQ29udmVydCByZWNlaXZlZCBsb2NhbGUgYW5kIGRhdGUgaW50byBhIHN0cmluZylcblxuICAgIE9VVFBVVFtbRGlzcGxheSByZXN1bHRdXVxuXG4gICAgU0VMRUNULS0-TE9DQUxFXG4gICAgSU5URVJWQUwtLT5USU1FU1RBTVBcblxuICAgIExPQ0FMRS0tPk1FUkdFXG4gICAgVElNRVNUQU1QLS0-TUVSR0VcblxuICAgIE1FUkdFLS0-T1VUUFVUXG5cbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOnRydWUsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjp0cnVlfQ

https://mermaid-js.github.io/mermaid/#/flowchart

graph LR

    SELECT{{#1 <select>: list of locales => onchange}}
    LOCALE(#1.1 <select>.value: selected locale)

    INTERVAL{{#2 Every second}}
    TIMESTAMP(#2.1 Current timestamp)

    MERGE(#3 Convert received locale and date into a string)

    OUTPUT[[Display result]]

    SELECT-->LOCALE
    INTERVAL-->TIMESTAMP

    LOCALE-->MERGE
    TIMESTAMP-->MERGE

    MERGE-->OUTPUT

 */

const DEFAULT_LANGUAGES = [
  'en',
  'fr',
  'de',
  'it',
  'es',
];

function createLocaleSelectElement(
  languages: string[] = DEFAULT_LANGUAGES,
): HTMLSelectElement {

  const selectElement = document.createElement('select');

  const displayNames = new Intl.DisplayNames(navigator.languages as string[], { type: 'language' });

  for (let i = 0, l = languages.length; i < l; i++) {
    const locale: string = languages[i];
    const optionElement = document.createElement('option');
    optionElement.value = locale;
    optionElement.innerText = displayNames.of(locale);
    selectElement.appendChild(optionElement);
  }

  return selectElement;
}

function formatDateExample1() {
  /* SHARED */

  const selectElement = createLocaleSelectElement();
  document.body.appendChild(selectElement);

  const outputElement = document.createElement('output');
  document.body.appendChild(outputElement);

  function formatDate(
    locale: string,
    date: number | Date,
  ): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    }).format(date);
  }


  /** CLASSIC **/

  function classic() {
    /* VARIABLES */

    // we create 2 variables that will store the selected locale and the current date
    let locale: string = selectElement.value;
    let date: number = Date.now();

    /* SHARED FUNCTIONS */

    // formats the date and time
    const getOutputValue = (): string => {
      return formatDate(locale, date);
    };

    // updates the <output> element
    const refresh = () => {
      outputElement.value = getOutputValue();
    };

    /* SELECT */

    // when the <select> element changes
    const onSelectElementChange = () => {
      // we update the locale
      locale = selectElement.value;
      // and we refresh the <output>
      refresh();
    };

    // creates an event listener on <select>
    selectElement.addEventListener('change', onSelectElementChange);

    /* DATE */

    // every second
    const timer = setInterval(() => {
      // we update the date
      date = Date.now();
      // and we refresh the <output>
      refresh();
    }, 1000);

    // call refresh to immediately display the current date
    refresh();

    // CLEAN function, to release resources
    return () => {
      selectElement.removeEventListener('change', onSelectElementChange);
      clearInterval(timer);
    };
  }

  // classic();


  /** OBSERVABLES **/

  function observables() {
    /* SELECT */

    // creates an observable on 'selectElement' when it's value changes
    const selectElementChange$ = fromEventTarget(selectElement, 'change');
    // allows to immediately emits an event for 'selectElement'
    const selectElementChangeImmediately$ = merge([selectElementChange$, single(void 0)]);

    // map this observable to return the <select>'s value (the locale)
    const locale$ = map$$(selectElementChangeImmediately$, () => selectElement.value);

    /* DATE */

    // creates an observable that triggers every second
    const timer$ = interval(1000);

    // map this observable to return the current date (as timestamp)
    const date$ = map$$(timer$, () => Date.now());

    /* MERGE */

    const output$ = function$$(
      [locale$, date$],
      formatDate,
    );

    return output$((value: string) => {
      outputElement.value = value;
    });
  }

  function observablesCondensed() {
    return function$$(
      [
        map$$(merge([fromEventTarget(selectElement, 'change'), single(void 0)]), () => selectElement.value),
        map$$(interval(1000), () => Date.now()),
      ],
      formatDate,
    )((value: string) => {
      outputElement.value = value;
    });
  }

  // observables();
  observablesCondensed();

}

/*----------------------*/

function formatDateExample2() {
  createLocaleFormatContext((locales$: IObservable<ILocales>) => {
    return pipe$$(interval(1000), [
      map$$$<void, number>(() => Date.now()),
      // dateTimeFormat$$$(locales$, single(DATE_TIME_FORMAT_MEDIUM_DATE)),
      dateTimeFormatS$$$(locales$, single('medium')),
    ]);
  });
}


/*----------------------*/

export function formatDateExample() {
  // formatDateExample1();
  formatDateExample2();
}

