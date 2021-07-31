import { IConstructor } from '../shared/constructor.type';
import { IInstanceOfType } from './instance-of.type';

export function instanceOfType(
  constructor: IConstructor,
): IInstanceOfType {
  return {
    name: 'instance-of',
    constructor,
  };
}
