export default class RoleInCompanyModel {
  public id: number = 0;
  public alias: string = "";
  public selected: boolean = false;

  public constructor(init?: Partial<RoleInCompanyModel>) {
    Object.assign(this, init);
  }
}
