import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";

export default class SelfCompany extends Company{
  public agentCompanyName:string | undefined = "";
  public parentCompanyName:string | undefined = "";
}
