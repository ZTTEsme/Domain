import RolePermissionSaveModel from "./rolePermissionSaveModel";

export default class RoleSaveModel {
  public id: number = 0;
  public alias: string = "";
  public permissions: RolePermissionSaveModel[] = [];

  public constructor(init?: Partial<RoleSaveModel>) {
    Object.assign(this, init);
  }
}
