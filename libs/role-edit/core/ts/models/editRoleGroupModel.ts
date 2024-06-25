import EditRoleGroupPermissionModel from "./editRoleGroupPermissionModel";

export default class EditRoleGroupModel {
  public show: boolean = false;
  public alias: string = "";
  public permissions: EditRoleGroupPermissionModel[] = [];

  public constructor(init?: Partial<EditRoleGroupModel>) {
    Object.assign(this, init);
  }
}
