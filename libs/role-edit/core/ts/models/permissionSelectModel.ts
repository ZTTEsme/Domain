export default class PermissionSelectModel {
  public id: string = "";
  public alias: string = "";
  public selected: boolean = false;
  public vendorSelected: boolean = false;

  public constructor(init?: Partial<PermissionSelectModel>) {
    Object.assign(this, init);
  }
}
