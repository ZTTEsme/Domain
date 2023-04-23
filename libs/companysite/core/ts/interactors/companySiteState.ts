import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import ValidationError from "../../../../common/entities/ts/validationError";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanySiteState{

  public pageInfo: PageInfo = new PageInfo(1,1,[1,20,3,4,5],1);

  public breadcrumb: Breadcrumb[] = [];

  public formErrors: FormErrors = {};

  public companySite:CompanySite[] = [];

  public company:Company[] = [];

  public showSearch: boolean = true;

  public moduleName: string = "";

  public isLoading: boolean = false;

  public openAddCompanySiteDialog: boolean = false;

  public validationErrors:ValidationError[]=[];

  //search
  public searchCompanySiteWasSuccess:boolean = false;
  public searchCompanySiteWasFailed:boolean = false;

  // add companySite
  public showAddCompanySiteSuccessMessage: boolean = false;
  public showAddCompanySiteFailureMessage: boolean = false;
  public validAddCompanySiteErrors: FormErrors={};
  public addCompanySiteFormData:CompanySite = new CompanySite();

  // modify companySite
  public openModifyCompanySiteDialog: boolean = false;
  public companySiteModifyAlias:string = "";
  public companySiteModifyCompanyId:number = 0;
  public showModifyCompanySiteFailureMessage=false;
  public showModifyCompanySiteSuccessMessage=false;
  public validModifyCompanySiteErrors: FormErrors={};
  public modifyCompanySiteFormData:CompanySite = new CompanySite();

  // delete companySite
  public openDeleteDialog: boolean = false;
  public showDeleteCompanySiteSuccessMessage: boolean = false;
  public showDeleteCompanySiteFailureMessage: boolean = false;
  public currentDeleteCompanyId: number = 0;


  public resetCompanySiteAddInputState():void{

  }
}
