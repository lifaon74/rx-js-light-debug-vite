const stack: number[][] = [];

type IOperation = '+' | '-' | '*' | '/';

/*---*/

function id(
  name?: string,
): number {
  console.log(name);
  if (stack.length === 0) {
    throw new Error(`id() used out of context`);
  } else {
    const ids: number[] = stack[stack.length - 1];
    const id: number = Math.random();
    ids.push(id);
    return id;
  }
}

function ctx(
  callback: () => number,
): any {
  stack.push([]);
  const result: number = callback();
  const ids: number[] = stack.pop() as number[];

  if (ids.length === 0) {
    throw new Error(`No id() used`);
  }

  const rec = (
    ids: number[],
    index: number,
    value: number,
    valueToSearch: number,
  ): IOperation[] | null => {
    if (value === valueToSearch) {
      return [];
    } else if (index < ids.length) {
      const id: number = ids[index];

      const op = (
        value: number,
        operation: IOperation,
      ): IOperation[] | null => {
        const result: IOperation[] | null = rec(
          ids,
          index + 1,
          value,
          valueToSearch,
        );

        if (result === null) {
          return null;
        } else {
          return [operation, ...result];
        }
      };

      let result: IOperation[] | null;
      if ((result = op(value + id, '+')) !== null) {
        return result;
      } else if ((result = op(value - id, '-')) !== null) {
        return result;
      } else if ((result = op(value * id, '*')) !== null) {
        return result;
      } else if ((result = op(value / id, '/')) !== null) {
        return result;
      } else {
        return null;
      }
    } else {
      return null;
    }


  };

  console.log(rec(ids, 1, ids[0], result));
}

function debugOperatorOverloading() {
  ctx(() => id('a') * (id('b') + id('c')));
}

