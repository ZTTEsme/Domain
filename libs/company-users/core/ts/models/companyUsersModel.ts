import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Dictionary from "qnect-sdk-web/lib/common/core/ts/interfaces/dictionary";
import CompanyListModel from "../../../../company/core/ts/models/companyListModel";
import CompanyUserModel from "../../../../company/core/ts/models/companyUserModel";
import UserInputModel from "../../../../company/core/ts/models/userInputModel";

export default class CompanyUsersModel {
  public msgTitle: string = "";
  public breadcrumb: Breadcrumb[] = [];
  public msgFilterTitle: string = "";
  public showLoadingIndicator: boolean = false;
  public selectedCompanyId: number | undefined;
  public msgNoSelectedCompany: string = "";
  public companies: CompanyListModel[] = [];
  public msgInviteUserAction: string = "";

  public msgUserAlias: string = "";
  public msgUserEmail: string = "";
  public msgUserIsAdmin: string = "";
  public msgUserActions: string = "";
  public msgUserIsAdminTrue: string = "";
  public msgUserIsAdminFalse: string = "";
  public msgNoUsers: string = "";
  public users: CompanyUserModel[] = [];
  public msgUserEditAction: string = "";
  public msgUserDeleteAction: string = "";

  public showUserDialog: boolean = false;
  public msgUserDialog: string = "";
  public msgUserIsAdminExplanation: string = "";
  public showAddUserSuccessMessage: boolean = false;
  public msgAddUserSuccessMessage: string = "";
  public showAddUserErrorMessage: boolean = false;
  public msgAddUserErrorMessage: string = "";
  public userInput: UserInputModel = new UserInputModel();
  public msgUserSaveAction: string = "";
  public formErrors: Dictionary<string> = {};
  public showSelectCompanyErrorMessage: boolean = false;
  public msgSelectCompanyErrorMessage: string = "";

  public showUserRemoveDialog: boolean = false;
  public msgRemoveUserDialog: string = "";
  public msgRemoveUserDialogText: string = "";
  public showRemoveSuccessMessage: boolean = false;
  public msgRemoveSuccessMessage: string = "";
  public showRemoveErrorMessage: boolean = false;
  public msgRemoveErrorMessage: string = "";
}
