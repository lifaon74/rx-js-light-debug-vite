import { ASCIIString } from '../../../classes/ascii-string/ascii-string.class';


export interface ISMTP$OK_RSP$Packet {
  version: ASCIIString;
  text: ASCIIString;
}


