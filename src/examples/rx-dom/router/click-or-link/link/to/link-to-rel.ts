import { ILinkType } from '../link-type.type';

export function linkToRel(
  {
    noreferrer = true,
    noopener = true,
  }: ILinkType,
): string {
  const rel: string[] = [];
  if (noreferrer) {
    rel.push('noreferrer');
  }
  if (noopener) {
    rel.push('noopener');
  }
  return rel.join(' ');
}

