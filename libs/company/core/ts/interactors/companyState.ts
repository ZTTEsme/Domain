import ValidationError from "../entities/validationError";
import FormErrors from "../entities/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanyState {

  public pageResultForCompany:PageResult = {
    data: [],
    total: 0
  };
  public pageInfo: PageInfo = new PageInfo(1,1,[1,2,3,4,5],1);

  public isLoading:boolean = false;

  public showSearch: boolean = true;

  public type:string = "";
  public agentCompanyId: number | undefined = 0;
  public alias:string = "";
  public customerId:string = "";
  public validationErrors:ValidationError[]=[];
  public formErrors: FormErrors = {};


  public companyAddState:any = {
    type :"",
    agentCompanyId:"",
    alias:"",
    customerId:""
  }

  public searchCompaniesWasSuccess: boolean = false
  public searchCompaniesWasFailed: boolean = false

  // delete company
  public showDeleteCompanySuccessMessage: boolean = false;
  public showDeleteCompanyFailureMessage: boolean = false;

  // delete dialog
  public openDeleteDialog: boolean = false;
  public deleteSentWithSuccess: boolean = false;
  public deleteSentWithFailure: boolean = false;
  public msgDeleteCompanyWithSuccess: string = "";
  public msgDeleteCompanyWithFailure: string = "";
  public currentDeleteCompanyId: string= ""

  // add company dialog
  public openAddCompanyDialog:boolean = false;
  public showAddCompanySuccessMessage:boolean = false;
  public showAddCompanyFailureMessage:boolean = false;

  // modify company dialog
  public openModifyCompanyDialog:boolean = false;
  public showModifyCompanySuccessMessage:boolean = false;
  public showModifyCompanyFailureMessage:boolean = false;

  public resetInputState(): void {
    this.type = "";
    this.agentCompanyId = 0;
    this.alias = "";
    this.customerId = "";
  }

  public resetCompanyAddInputState():void{
    this.companyAddState.type = "";
    this.companyAddState.agentCompanyId = "";
    this.companyAddState.alias = "";
    this.companyAddState.customerId = "";
  }
}
