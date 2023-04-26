import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import AddCompanySiteFormData from "../entities/addCompanySiteFormData";
import ModifyCompanySiteFormData from "../entities/modifyCompanySiteFormData";
import LabelInfo from "../entities/labelInfo";
import SearchForm from "../entities/searchForm";
import TableAction from "../entities/tableAction";
import CompanySiteTableColName from "../entities/companySiteTableColName";
import Dialog from "../entities/dialog";

export default class CompanySiteModel {

  public pageResultForCompanySite:PageResult = {
    data: [],
    total: 0
  };

  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20]);

  public breadcrumb: Breadcrumb[] = [];

  // add companySite
  public addCompanySiteFormData: AddCompanySiteFormData = new AddCompanySiteFormData();

  public validAddCompanySiteFormErrors: FormErrors = {};

  // modify companySite
  public modifyCompanySiteFormData: ModifyCompanySiteFormData = new ModifyCompanySiteFormData();

  public validModifyCompanySiteFormErrors: FormErrors = {};

  public isLoading: boolean = false;

  public companySite:CompanySite[] = [];

  public selectedCompany:Company | null = null;

  public companiesForSelect:Company[] = [];

  public showSearch: boolean = true;

  public moduleName: string = "";

  public searchCompanySiteWasSuccess: boolean = false;

  public searchCompanySiteWasFailed: boolean = false;

  public labelInfo:LabelInfo = new LabelInfo();

  public searchForm:SearchForm = new SearchForm();

  public tableAction:TableAction = new TableAction();

  public companySiteTableColName:CompanySiteTableColName = new CompanySiteTableColName();

  public dialog:Dialog = new Dialog();

  public constructor(init?: Partial<CompanySite>) {
    Object.assign(this,init);
  }

}
