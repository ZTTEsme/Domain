import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyInputModel from "../models/companyInputModel";

export default class CompanyState {
  public companies: Company[] = [];
  public filteredCompanies: Company[] = [];

  public filterAgentId: number | undefined;

  public isLoading: boolean = false;

  public companyInput: CompanyInputModel = new CompanyInputModel();

  public companyFilteredWithSuccess: boolean = false;
  public companyFilteredWithFailure: boolean = false;

  public companyEditId: number | undefined;
  public companyDialogOpen: boolean = false;
  public companyCreatedWithFailure: boolean = false;
  public companyCreatedWithSuccess: boolean = false;
  public companyUpdatedWithFailure: boolean = false;
  public companyUpdatedWithSuccess: boolean = false;

  public toDeleteCompanyId: string | undefined;
  public openDeleteDialog: boolean = false;
  public companyDeletedWithSuccess: boolean = false;
  public companyDeletedWithFailure: boolean = false;
}
