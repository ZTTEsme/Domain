import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import SelfCompany from "../entities/SelfCompany";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";

export default class CompanyModel {


  public username:string="";
  public password:string="";

  public pageResultForCompany:PageResult = {
    data: [],
    total: 0
  };

  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20]);

  public breadcrumb: Breadcrumb[] = [];

  public moduleName: string ="";

  public msg: string = "";

  public company:SelfCompany[] = [];
  public allCompanies:Company[] = [];

  public formErrors: FormErrors = {};

  public showSearch: boolean = true;

  public searchCompaniesWasSuccess: boolean = false;

  public searchCompaniesWasFailed: boolean = false;

  public isLoading:boolean = false

  public labelInfo:any={
    agentCompanyLabel:""
  }

  public searchForm:any = {
    agentCompanyId:null,
    companyId:null
  }


  public tableAction: any = {
    add:"",
    delete:"",
    modify:""
  }

  public dialog: any = {
    // add company
    addCompany:"",
    close:"",
    submit:"",
    openAddCompanyDialog:false,
    showAddCompanyFailureMessage:false,
    showAddCompanySuccessMessage:false,
    msgAddCompanyWithSuccess:"",
    msgAddCompanyWithFailure:"",

    // delete company
    openDeleteDialog:false,
    deleteCompany:"",
    deleteTipInfo:"",
    msgDeleteCompanyWithSuccess:"",
    showDeleteCompanyFailureMessage:false,
    showDeleteCompanySuccessMessage:false,
    msgDeleteCompanyWithFailure:"",
    currentDeleteCompanyId:"",

    // modify company
    modifyCompanyTitle:"",
    openModifyCompanyDialog:false,

    showModifyCompanySuccessMessage:false,
    msgModifyCompanyWithSuccess:"",

    showModifyCompanyFailureMessage:false,
    msgModifyCompanyWithFailure:""
  }

  public formData = {
    alias:"",
    type:"",
    agentCompanyId:"",
    customerId:""
  }


  public companyTableColName:any={
    alias:"",
    type:"",
    agentCompanyId:"",
    customerId:"",
    operate:"",
  }

  public constructor(init?: Partial<CompanyModel>) {
    Object.assign(this, init);
  }

}
