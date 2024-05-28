import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import FormErrors from "../../../../common/entities/ts/formError";
import ValidationError from "../../../../common/entities/ts/validationError";
import CompanyAddState from "../entities/companyAddState";
import Dialog from "../entities/dialog";

export default class CompanyState {
  public companies: Company[] = [];
  public companiesFiltered: Company[] = [];

  public filterAgentId: number | undefined = undefined;

  public isLoading: boolean = false;

  public showSearch: boolean = true;

  public type: string = "";

  public alias: string = "";
  public customerId: string = "";

  public validationErrors: ValidationError[] = [];
  public formErrors: FormErrors = {};

  public companyAddState: CompanyAddState = new CompanyAddState();

  public dialog: Dialog = new Dialog();

  public searchCompaniesWasSuccess: boolean = false;
  public searchCompaniesWasFailed: boolean = false;

  public resetCompanyAddInputState(): void {
    this.companyAddState.type = "";
    this.companyAddState.agentCompanyId = null;
    this.companyAddState.alias = "";
    this.companyAddState.customerId = "";
  }
}
