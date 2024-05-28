import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import FormErrors from "../../../../common/entities/ts/formError";
import ValidationError from "../../../../common/entities/ts/validationError";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import UserTableColName from "../entities/userTableColName";

export default class CompanyUsersState {
  public selectedCompanyId: number | null = null;

  public companies: Company[] = [];

  public users: CompanyUser[] = [];

  public currentDeleteCompanyUserId: string = "";

  public userTableColName: UserTableColName = new UserTableColName();

  public isLoading: boolean = false;

  public dialog: Dialog = new Dialog();

  // add user
  public addUserFormData: AddUserFormData = new AddUserFormData();
  public validAddCompanyUserErrors: ValidationError[] = [];
  public validAddCompanyUserFormErrors: FormErrors = {};
}
