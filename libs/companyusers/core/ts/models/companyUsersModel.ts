import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import FormErrors from "../../../../common/entities/ts/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import SearchForm from "../../../../company/core/ts/entities/searchForm";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import LabelInfo from "../entities/labelInfo";
import UserTableColName from "../entities/userTableColName";

export default class CompanyUsersModel {
  public pageResultForUsers: PageResult = {
    data: [],
    total: 0,
  };

  public users: CompanyUser[] = [];

  public pageInfo: PageInfo = new PageInfo(1, 5, [5, 10, 20]);

  public breadcrumb: Breadcrumb[] = [];

  public showSearch: boolean = false;

  public labelInfo: LabelInfo = new LabelInfo();

  public searchForm: SearchForm = new SearchForm();

  public isLoading: boolean = false;

  public userTableColName: UserTableColName = new UserTableColName();

  public searchCompanyUsersWasFailed: boolean = false;

  public dialog: Dialog = new Dialog();

  public validAddUserFormErrors: FormErrors = {};

  public addUserFormData: AddUserFormData = new AddUserFormData();

  public companies: Company[] = [];

  public selectedCompanyId: number | null = null;
}
