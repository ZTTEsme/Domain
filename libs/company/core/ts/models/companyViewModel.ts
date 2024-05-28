import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanyTableColName from "../entities/companyTableColName";
import Dialog from "../entities/dialog";
import FormDatas from "../entities/formDatas";
import LabelInfo from "../entities/labelInfo";
import TableAction from "../entities/tableAction";
import CompanyListModel from "./companyListModel";

export default class CompanyModel {
  public username: string = "";
  public password: string = "";

  public pageResultForCompany: PageResult = {
    data: [],
    total: 0,
  };

  public breadcrumb: Breadcrumb[] = [];

  public moduleName: string = "";

  public msg: string = "";

  public companiesNotFiltered: CompanyListModel[] = [];
  public companiesFiltered: CompanyListModel[] = [];

  public filterAgentId: number | undefined = undefined;

  public formErrors: FormErrors = {};

  public showSearch: boolean = true;

  public searchCompaniesWasSuccess: boolean = false;

  public searchCompaniesWasFailed: boolean = false;

  public isLoading: boolean = false;

  public labelInfo: LabelInfo = new LabelInfo();

  public tableAction: TableAction = new TableAction();

  public dialog: Dialog = new Dialog();

  public formData: FormDatas = new FormDatas();

  public companyTableColName: CompanyTableColName = new CompanyTableColName();

  public constructor(init?: Partial<CompanyModel>) {
    Object.assign(this, init);
  }
}
