import {
  createMulticastReplayLastSource, IMulticastReplayLastSource, ISubscribeFunction, reactiveFunction
} from '@lifaon/rx-js-light';


/** CUSTOM ELEMENT EXAMPLE **/

function customElementWithoutObservable() {

  /**
   * Example of bad implementation
   *
   *  If someone want to refactor / change the display of fullName it's dangerous,
   *  because he has to check everywhere where fullName is used and assigned
   */
    // NEW => added by someone else later
  class MyElement extends HTMLElement {

    fullName: string = ''; // SHOULD BE PROTECTED

    protected _firstName: string = '';
    protected _lastName: string = '';

    protected _prefix: string = ''; // NEW

    constructor() {
      super();
    }

    get firstName(): string {
      return this._firstName;
    }

    set firstName(value: string) {
      this._firstName = value;
      this.fullName = `${ this._firstName } ${ this._lastName }`; // BAD: assigning a computed value, may lead to forgotten update or refresh
      this.updateContent(); // BAD: may lead to forgotten update
    }

    get lastName(): string {
      return this._lastName;
    }

    set lastName(value: string) {
      this._lastName = value;
      this.fullName = `${ this._firstName } ${ this._lastName }`; // BAD: for same reason as seen previously + code duplication
      this.updateContent();
    }

    // NEW - START
    get prefix(): string {
      return this._prefix;
    }

    set prefix(value: string) {
      this._prefix = value;
      // OOPS every other assignation of this.fullName have been forgotten leading to invalid value if someone set 'lastName' for example
      this.fullName = `${ this._prefix } ${ this._firstName } ${ this._lastName }`;
      this.updateContent();
    }

    // NEW - END

    protected updateContent(): void {
      this.innerText = this.fullName;
    }
  }

  customElements.define('my-element', MyElement);

  const element = new MyElement();
  document.body.appendChild(element);
  element.prefix = 'Mr';
  element.firstName = 'SpongeBob';
  element.lastName = 'SquarePants';
}

function customElementWithObservable() {
  class MyElement extends HTMLElement {
    protected _$prefix$: IMulticastReplayLastSource<string>;
    protected _$firstName$: IMulticastReplayLastSource<string>;
    protected _$lastName$: IMulticastReplayLastSource<string>;

    protected _fullName$: ISubscribeFunction<string>;

    constructor() {
      super();
      this._$prefix$ = createMulticastReplayLastSource<string>({ initialValue: '' });
      this._$firstName$ = createMulticastReplayLastSource<string>({ initialValue: '' });
      this._$lastName$ = createMulticastReplayLastSource<string>({ initialValue: '' });

      // fulName is a computed variable so we use a reactiveFunction
      this._fullName$ = reactiveFunction([
        this._$prefix$.subscribe,
        this._$firstName$.subscribe,
        this._$lastName$.subscribe,
      ], (
        prefix: string,
        firstName: string,
        lastName: string,
      ): string => {
        return `${ prefix } ${ firstName } ${ lastName }`;
      });

      this._fullName$((value: string) => {
        this.innerText = value;
      });
    }

    get firstName(): string {
      return this._$firstName$.getValue();
    }

    set firstName(value: string) {
      this._$firstName$.emit(value);
    }

    get lastName(): string {
      return this._$lastName$.getValue();
    }

    set lastName(value: string) {
      this._$lastName$.emit(value);
    }

    get prefix(): string {
      return this._$prefix$.getValue();
    }

    set prefix(value: string) {
      this._$prefix$.emit(value);
    }
  }

  customElements.define('my-element', MyElement);

  const element = new MyElement();
  document.body.appendChild(element);
  element.prefix = 'Mr';
  element.firstName = 'SpongeBob';
  element.lastName = 'SquarePants';
}

/*-------------*/

export function reactiveVariableCustomElementExample() {
  // customElementWithoutObservable();
  customElementWithObservable();
}

