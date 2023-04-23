import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanySiteModel {

  public pageResultForCompanySite:PageResult = {
    data: [],
    total: 0
  };

  public pageInfo: PageInfo = new PageInfo(1,1,[1,20,3,4,5]);

  public breadcrumb: Breadcrumb[] = [];

  // add companySite
  public addCompanySiteFormData:CompanySite = new CompanySite();
  public validAddCompanySiteErrors: FormErrors = {};

  // modify companySite
  public modifyCompanySiteFormData:CompanySite = new CompanySite();
  public validModifyCompanySiteErrors: FormErrors = {};

  public isLoading: boolean = false;

  public companySite:CompanySite[] = [];
  public company:Company[] = [];

  public showSearch: boolean = true;

  public moduleName: string = "";

  public searchCompanySiteWasSuccess: boolean = false;
  public searchCompanySiteWasFailed: boolean = false;

  public labelInfo:any = {
    companyId:""
  }

  public searchForm:any = {
    companyId:"",
    companySiteId:""
  }

  public tableAction: any = {
    add:"",
    delete:"",
    modify:""
  }

  public companySiteTableColName:any={
    id:"",
    alias:"",
    companyId:"",
    operate:"",
  }

  public dialog: any = {
    // add companySite
    addCompanySite:"",
    close:"",
    submit:"",
    openAddCompanySiteDialog:false,
    showAddCompanySiteFailureMessage:false,
    showAddCompanySiteSuccessMessage:false,
    msgAddCompanySiteWithSuccess:"",
    msgAddCompanySiteWithFailure:"",

    // delete companySite
    openDeleteDialog:false,
    deleteCompanySiteTitle:"",
    deleteTipInfo:"",
    msgDeleteCompanySiteWithSuccess:"",
    showDeleteCompanySiteSuccessMessage:false,

    showDeleteCompanySiteFailureMessage:false,
    msgDeleteCompanySiteWithFailure:"",
    currentDeleteCompanyId:"",

    // modify companySite
    modifyCompanySiteTitle:"",
    openModifyCompanySiteDialog:false,

    showModifyCompanySiteSuccessMessage:false,
    msgModifyCompanySiteWithSuccess:"",

    showModifyCompanySiteFailureMessage:false,
    msgModifyCompanySiteWithFailure:""
  }

  public constructor(init?: Partial<CompanySite>) {
    Object.assign(this,init);
  }

}
