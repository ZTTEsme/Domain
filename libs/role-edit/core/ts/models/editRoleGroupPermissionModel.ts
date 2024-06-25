export default class EditRolePermissionModel {
  public appId: string | undefined = undefined;
  public serviceId: string | undefined = undefined;
  public permissionId: string = "";
  public alias: string = "";
  public selected: boolean = false;
  public show: boolean = false;

  public constructor(init?: Partial<EditRolePermissionModel>) {
    Object.assign(this, init);
  }
}
