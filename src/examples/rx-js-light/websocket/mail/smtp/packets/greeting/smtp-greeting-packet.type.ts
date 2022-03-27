import { ASCIIString } from '../../../classes/ascii-string/ascii-string.class';
import { Domain } from '../../../classes/domain/domain.class';

export interface ISMTP$GREETING$Packet {
  domain: Domain;
  text: ASCIIString;
}

