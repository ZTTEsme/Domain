import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import UserInputModel from "../../../../company/core/ts/models/userInputModel";

export default class CompanyUsersState {
  // public users: CompanyUser[] = [];
  // public currentDeleteCompanyUserId: string = "";
  // public userTableColName: UserTableColName = new UserTableColName();
  // public dialog: Dialog = new Dialog();

  // add user
  // public validAddCompanyUserErrors: ValidationError[] = [];
  // public validAddCompanyUserFormErrors: FormErrors = {};
  // public addUserFormData: AddUserFormData = new AddUserFormData();

  // NEW --- NEW --- NEW --- NEW
  public selectedCompanyId: number | undefined;
  public companyLoadedWithFailure: boolean = false;
  public companies: Company[] = [];
  public users: CompanyUser[] = [];
  public isLoading: boolean = false;

  public addUserDialogOpen: boolean = false;
  public addUserInput: UserInputModel = new UserInputModel();
  public userAddedWithFailure: boolean = false;
  public userAddedWithSuccess: boolean = false;

  public removeUserDialogOpen: boolean = false;
  public toRemoveUserId: string | undefined;
  public userRemovedWithFailure: boolean = false;
  public userRemovedWithSuccess: boolean = false;
}
