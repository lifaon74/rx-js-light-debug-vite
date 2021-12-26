export interface IEmailAddress {
  username: string;
  hostname: string;
}

export type IReadonlyEmailAddress = Readonly<IEmailAddress>;
