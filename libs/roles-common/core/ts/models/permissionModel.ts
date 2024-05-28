export default class PermissionModel {
  public appId: string | undefined = undefined;
  public serviceId: string | undefined = undefined;
  public permissionId: string = "";
  public translations: Map<string, string> = new Map<string, string>();

  public constructor(init?: Partial<PermissionModel>) {
    Object.assign(this, init);
  }
}
