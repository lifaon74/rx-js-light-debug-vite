import { ASCIIString } from '../ascii-string/ascii-string.class';
import { Domain } from '../domain/domain.class';
import { generateUID } from '../../../misc/generate-uuid';

export class MessageId {

  static generate(
    domain: Domain,
    size: number = 16,
  ): MessageId {
    return new MessageId(
      ASCIIString.fromSafeString(generateUID(size)),
      domain.value,
    );
  }

  readonly left: ASCIIString;
  readonly right: ASCIIString;

  constructor(
    left: ASCIIString,
    right: ASCIIString,
  ) {
    this.left = left;
    this.right = right;
  }

  toString(): string {
    return `${this.left.toString()}@${this.right.toString()}`;
  }
}
