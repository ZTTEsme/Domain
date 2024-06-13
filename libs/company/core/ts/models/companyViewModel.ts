import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Dictionary from "qnect-sdk-web/lib/common/core/ts/interfaces/dictionary";
import CompanyInputModel from "./companyInputModel";
import CompanyListModel from "./companyListModel";

export default class CompanyViewModel {
  public msgTitle: string = "";
  public breadcrumb: Breadcrumb[] = [];

  public unfilteredCompanies: CompanyListModel[] = [];
  public filteredCompanies: CompanyListModel[] = [];
  public msgFilterTitle: string = "";
  public msgChooseAllFilter: string = "";
  public filterAgentId: number | undefined;
  public msgCreateCompanyAction: string = "";
  public msgCompanyAlias: string = "";
  public msgCompanyType: string = "";
  public msgCompanyParent: string = "";
  public msgCompanyAgent: string = "";
  public msgCompanyCustomer: string = "";
  public msgCompanyActions: string = "";
  public msgNoCompanies: string = "";
  public msgCompanyEditAction: string = "";
  public msgCompanyDetailsAction: string = "";
  public msgCompanyDeleteAction: string = "";
  public showFilterErrorMessage: boolean = false;
  public msgFilterErrorMessage: string = "";
  public showDeleteDialog: boolean = false;
  public msgDeleteCompany: string = "";
  public msgDeleteCompanyText: string = "";
  public showDeleteSuccessMessage: boolean = false;
  public msgDeleteSuccessMessage: string = "";
  public showDeleteErrorMessage: boolean = false;
  public msgDeleteErrorMessage: string = "";
  public msgDeleteAction: string = "";
  public showCompanyDialog: boolean = false;
  public msgCompanyDialog: string = "";
  public msgSaveSuccessMessage: string = "";
  public msgSaveErrorMessage: string = "";
  public showSaveSuccessMessage: boolean = false;
  public showSaveErrorMessage: boolean = false;
  public msgCompanyTypeCustomer: string = "";
  public msgCompanyTypeManufacturer: string = "";
  public msgCompanyTypeTrader: string = "";
  public msgCompanyTypeSubsidiary: string = "";
  public companyInput: CompanyInputModel = new CompanyInputModel();
  public msgCompanySaveAction: string = "";
  public formErrors: Dictionary<string> = {};
  public showLoadingIndicator: boolean = false;

  public constructor(init?: Partial<CompanyViewModel>) {
    Object.assign(this, init);
  }
}
