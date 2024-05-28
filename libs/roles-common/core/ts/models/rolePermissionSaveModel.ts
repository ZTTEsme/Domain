export default class RolePermissionSaveModel {
  public appId: string | undefined = undefined;
  public serviceId: string | undefined = undefined;
  public permissionId: string | undefined = undefined;

  public constructor(init?: Partial<RolePermissionSaveModel>) {
    Object.assign(this, init);
  }
}
