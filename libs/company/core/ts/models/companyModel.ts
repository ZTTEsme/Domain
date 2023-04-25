import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import SelfCompany from "../entities/selfCompany";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import LabelInfo from "../entities/labelInfo";
import SearchForm from "../entities/searchForm";
import TableAction from "../entities/tableAction";
import Dialog from "../entities/dialog";
import FormDatas from "../entities/formDatas";
import CompanyTableColName from "../entities/companyTableColName";

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

  public labelInfo: LabelInfo = new LabelInfo();

  public searchForm: SearchForm = new SearchForm();

  public tableAction:TableAction = new TableAction();

  public dialog:Dialog = new Dialog();

  public formData:FormDatas = new FormDatas();

  public companyTableColName:CompanyTableColName = new CompanyTableColName();

  public constructor(init?: Partial<CompanyModel>) {
    Object.assign(this, init);
  }

}
