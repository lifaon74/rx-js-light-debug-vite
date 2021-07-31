import { IType } from '../shared/type.type';
import { IConstructor } from '../shared/constructor.type';

export interface IInstanceOfType extends IType {
  name: 'instance-of';
  constructor: IConstructor;
}
