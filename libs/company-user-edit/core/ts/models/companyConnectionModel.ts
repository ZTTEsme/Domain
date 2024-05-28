import PakLoginDataModel from "./pakLoginDataModel";
import RoleInCompanyModel from "./roleInCompanyModel";

export default class CompanyConnectionModel {
  public companyId: number = 0;
  public companyName: string = "";
  public admin: boolean = false;
  public roleSummary: string = "";
  public roles: RoleInCompanyModel[] = [];
  public pakIdSet: boolean = false;
  public pakSummary: string = "";
  public pakLogins: PakLoginDataModel[] = [];

  public constructor(init?: Partial<CompanyConnectionModel>) {
    Object.assign(this, init);
  }
}
