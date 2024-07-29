import PermissionModel from "./permissionModel";

export default class RoleListModel {
  public id: number = 0;
  public alias: string = "";
  public defaultRole: boolean = false;
  public permissions: PermissionModel[] = [];

  public constructor(init?: Partial<RoleListModel>) {
    Object.assign(this, init);
  }
}
