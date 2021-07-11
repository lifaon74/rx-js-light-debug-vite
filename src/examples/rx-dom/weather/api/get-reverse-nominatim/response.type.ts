/** RESPONSE **/

export type IGetReverseNominatimStringNumber = string;

export type IGetReverseNominatimJSONResponseBoundingBox = [IGetReverseNominatimStringNumber, IGetReverseNominatimStringNumber, IGetReverseNominatimStringNumber, IGetReverseNominatimStringNumber];

export interface IGetReverseNominatimJSONResponseAddress {
  building: string;
  house_number: string;
  road: string;
  suburb: string;
  town: string;
  municipality: string;
  state: string;
  postcode: string;
  country: string;
  country_code: string;
}

// RESPONSE

export interface IGetReverseNominatimJSONResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: IGetReverseNominatimStringNumber;
  lon: IGetReverseNominatimStringNumber;
  display_name: string;
  address: IGetReverseNominatimJSONResponseAddress;
  boundingbox: IGetReverseNominatimJSONResponseBoundingBox;
}

