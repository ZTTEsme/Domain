export default class CompanyUserModel {
  public id: number | undefined;
  public alias: string = "";
  public email: string = "";
  public isAdmin: boolean = false;
  public link: string = "";

  public constructor(init?: Partial<CompanyUserModel>) {
    Object.assign(this, init);
  }
}
