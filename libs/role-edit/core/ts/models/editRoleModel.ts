import EditRolePermissionModel from "./editRolePermissionModel";

export default class EditRoleModel {
  public id: number | undefined = undefined;
  public alias: string = "";
  public permissions: EditRolePermissionModel[] = [];

  public constructor(init?: Partial<EditRoleModel>) {
    Object.assign(this, init);
  }
}
