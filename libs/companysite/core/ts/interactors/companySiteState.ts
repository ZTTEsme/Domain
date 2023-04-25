import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import ValidationError from "../../../../common/entities/ts/validationError";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import AddCompanySiteFormData from "../entities/addCompanySiteFormData";
import ModifyCompanySiteFormData from "../entities/modifyCompanySiteFormData";

export default class CompanySiteState{

  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20],1);

  public breadcrumb: Breadcrumb[] = [];

  public companyId: number | null = null;

  public companySite:CompanySite[] = [];

  public company:Company | null = null;

  public showSearch: boolean = true;

  public moduleName: string = "";

  public isLoading: boolean = false;

  public openAddCompanySiteDialog: boolean = false;

  //search
  public searchCompanySiteWasSuccess:boolean = false;
  public searchCompanySiteWasFailed:boolean = false;

  // add companySite
  public showAddCompanySiteSuccessMessage: boolean = false;
  public showAddCompanySiteFailureMessage: boolean = false;
  public validAddCompanySiteErrors: ValidationError[]=[];
  public validAddCompanySiteFormErrors: FormErrors={};
  public addCompanySiteFormData:AddCompanySiteFormData = new AddCompanySiteFormData();

  // modify companySite
  public openModifyCompanySiteDialog: boolean = false;
  public companySiteModifyAlias:string = "";
  public companySiteModifyCompanyId:number|null = null;
  public showModifyCompanySiteFailureMessage=false;
  public showModifyCompanySiteSuccessMessage=false;
  public validModifyCompanySiteErrors: ValidationError[]=[];
  public validModifyCompanySiteFormErrors: FormErrors={};
  public modifyCompanySiteFormData:ModifyCompanySiteFormData = new ModifyCompanySiteFormData();

  // delete companySite
  public openDeleteDialog: boolean = false;
  public showDeleteCompanySiteSuccessMessage: boolean = false;
  public showDeleteCompanySiteFailureMessage: boolean = false;
  public currentDeleteCompanySiteId: number|null = null;


  public resetCompanySiteAddInputState():void{

  }
}
