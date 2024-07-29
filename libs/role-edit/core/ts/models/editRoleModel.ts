import EditRoleGroupModel from "./editRoleGroupModel";

export default class EditRoleModel {
  public id: number | undefined = undefined;
  public alias: string = "";
  public defaultRole: boolean = false;
  public groups: EditRoleGroupModel[] = [];

  public constructor(init?: Partial<EditRoleModel>) {
    Object.assign(this, init);
  }
}
