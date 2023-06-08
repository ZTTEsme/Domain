import ValidationError from "../../../../common/entities/ts/validationError";
import FormErrors from "../../../../common/entities/ts/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import SearchForm from "../entities/searchForm";
import Dialog from "../entities/dialog";
import CompanyAddState from "../entities/companyAddState";

export default class CompanyState {


  public pageResultForCompany:PageResult = {
    data: [],
    total: 0
  };
  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20],1);

  public isLoading:boolean = false;

  public showSearch: boolean = true;

  public type:string = "";

  public alias:string = "";
  public customerId:string = "";

  public validationErrors:ValidationError[]=[];
  public formErrors: FormErrors = {};

  public resCompanies:Company[] = []

  public allCompanies:Company[] = []

  public searchForm: SearchForm = new SearchForm();

  public companyAddState:CompanyAddState = new CompanyAddState();

  public dialog:Dialog = new Dialog();

  public searchCompaniesWasSuccess: boolean = false
  public searchCompaniesWasFailed: boolean = false

  public resetInputState(): void {
    this.type = "";
    this.searchForm.agentCompanyId = undefined;
    this.searchForm.companyId = undefined;
    this.alias = "";
    this.customerId = "";
  }

  public resetCompanyAddInputState():void{
    this.companyAddState.type = "";
    this.companyAddState.agentCompanyId = null;
    this.companyAddState.alias = "";
    this.companyAddState.customerId = "";
  }


}
