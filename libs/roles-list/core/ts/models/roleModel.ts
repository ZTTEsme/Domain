export default class RoleModel {
  public alias: string = "";
  public editLink: string = "";

  public constructor(init?: Partial<RoleModel>) {
    Object.assign(this, init);
  }
}
