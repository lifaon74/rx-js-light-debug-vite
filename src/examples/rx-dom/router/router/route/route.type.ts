import { Path } from '../path/path.class';

export type IRoutePath = Path;

export interface IRoute<GExtra> {
  path: IRoutePath;
  children?: IRoute<GExtra>[];
  extra?: GExtra;
}

export type IGenericRoute = IRoute<any>;
