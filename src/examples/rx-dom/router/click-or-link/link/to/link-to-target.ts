import { ILinkType } from '../link-type.type';

export function linkToTarget(
  {
    target,
  }: ILinkType,
): string {
  return (target === void 0)
    ? '_self'
    : target;
}
