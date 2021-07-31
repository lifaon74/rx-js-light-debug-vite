import { IInterfaceType } from '../interface-type.type';
import { intersectInterfaces } from './create-interface-type-from-intersections';

export function extendInterface(
  type: IInterfaceType,
  parents: Iterable<IInterfaceType>,
): IInterfaceType {
  return intersectInterfaces([type, ...parents]);
}
