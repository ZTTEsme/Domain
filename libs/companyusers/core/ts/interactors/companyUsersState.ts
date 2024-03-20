import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import CompanyWithUsers from "qnect-sdk-web/lib/company/core/ts/entities/companyWithUsers";
import FormErrors from "../../../../common/entities/ts/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import ValidationError from "../../../../common/entities/ts/validationError";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import UserTableColName from "../entities/userTableColName";

export default class CompanyUsersState {
  public selectedCompanyId: number | null = null;
  public selectedCompanySiteId: number | null = null;

  public companies: Company[] = [];

  public companyWithUsers: CompanyWithUsers = new CompanyWithUsers();

  public users: CompanyUser[] = [];

  public pageResultForUsers: PageResult = {
    data: [],
    total: 0,
  };

  public currentDeleteCompanySiteUserId: string = "";

  public pageInfo: PageInfo = new PageInfo(1, 5, [5, 10, 20], 1);

  public userTableColName: UserTableColName = new UserTableColName();

  public isLoading: boolean = false;

  public dialog: Dialog = new Dialog();

  // add user
  public addUserFormData: AddUserFormData = new AddUserFormData();
  public validAddCompanySiteUserErrors: ValidationError[] = [];
  public validAddCompanySiteUserFormErrors: FormErrors = {};
}
