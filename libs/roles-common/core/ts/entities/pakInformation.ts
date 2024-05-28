import { DateTime } from "luxon";

export default class PakInformation {
  public pakId: string = "";
  public deviceId: number = 0;
  public timestamp: DateTime = DateTime.now();

  public constructor(init?: Partial<PakInformation>) {
    Object.assign(this, init);
  }
}
