export default class CompanyListModel {
  public id: number | null = null;
  public alias: string = "";
  public type: string = "";
  public parentCompanyId: number | null = null;
  public parentCompanyName: string = "";
  public agentCompanyId: number | null = null;
  public agentCompanyName: string = "";
  public customerId: string = "";
  public link: string = "";

  public constructor(init?: Partial<CompanyListModel>) {
    Object.assign(this, init);
  }
}
