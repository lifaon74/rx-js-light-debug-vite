import { reactiveVariableMinMaxExample } from './min-max.example';
import { reactiveVariableFormExample } from './form.example';
import { reactiveVariableCustomElementExample } from './custom-element.example';


/*
  ISSUE:

    Having variables that depend on each others (computed variables), may easily lead to INCONSISTENCY:
    it's easy to forget to update / refresh some variables, which creates incoherent state in your application,
    especially when multiple developers works on the same codebase.

    That's why assigning a computed value that may evolve through time should be avoided.

    A common workaround is to use getters or functions, but you still may forget to notify that theses values have changed.
    It's an extremely common source of bug, and for complex application with thousand of theses variables,
    it sometimes very complicated to maintain a consistent state.
    I've seen this bad practice in many projects (too much), leading to very difficult bugs to resolve.

  SOLUTION:

    Each of your variables which may mutate over time, SHOULD be converted into Observables.
    And every computed values SHOULD be Observables built from piping these variables (mostly using map or filter for example).
*/

export function reactiveVariableExample() {
  // reactiveVariableMinMaxExample();
  reactiveVariableCustomElementExample();
  // reactiveVariableFormExample();
}
