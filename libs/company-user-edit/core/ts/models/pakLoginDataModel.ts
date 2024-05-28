export default class PakLoginDataModel {
  public pakId: string = "";
  public description: string = "";

  public constructor(init?: Partial<PakLoginDataModel>) {
    Object.assign(this, init);
  }
}
