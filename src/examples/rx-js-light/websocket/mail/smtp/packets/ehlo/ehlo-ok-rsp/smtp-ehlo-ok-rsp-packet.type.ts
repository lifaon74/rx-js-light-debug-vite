import { ASCIIString } from '../../../../classes/ascii-string/ascii-string.class';
import { Domain } from '../../../../classes/domain/domain.class';


export interface ISMTP$EHLO_OK_RSP$Packet {
  domain: Domain;
  greet: ASCIIString;
  lines: ISMTP$EHLO_OK_RSP$PacketLine[];
}


export interface ISMTP$EHLO_OK_RSP$PacketLine {
  keyword: ASCIIString;
  params: ASCIIString[];
}
