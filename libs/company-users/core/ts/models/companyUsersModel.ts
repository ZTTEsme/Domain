import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import FormErrors from "../../../../common/entities/ts/formError";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import LabelInfo from "../entities/labelInfo";
import UserTableColName from "../entities/userTableColName";

export default class CompanyUsersModel {
  public users: CompanyUser[] = [];

  public breadcrumb: Breadcrumb[] = [];

  public showCompaniesMenue: boolean = false;

  public labelInfo: LabelInfo = new LabelInfo();

  public isLoading: boolean = false;

  public userTableColName: UserTableColName = new UserTableColName();

  public searchCompanyUsersWasFailed: boolean = false;

  public dialog: Dialog = new Dialog();

  public validAddUserFormErrors: FormErrors = {};

  public addUserFormData: AddUserFormData = new AddUserFormData();

  public companies: Company[] = [];

  public selectedCompanyId: number | null = null;
}
