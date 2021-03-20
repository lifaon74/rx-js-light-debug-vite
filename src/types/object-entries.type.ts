type IObjectEntriesRaw<GObject extends object> = {
  [GKey in keyof GObject]: [GKey, GObject[GKey]];
}

export type IObjectEntries<GObject extends object> = IObjectEntriesRaw<GObject>[keyof IObjectEntriesRaw<GObject>];
