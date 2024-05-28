import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import Dictionary from "qnect-sdk-web/lib/common/core/ts/interfaces/dictionary";
import EditRoleModel from "./editRoleModel";

export default class RolesEditViewModel {
  public breadcrumb: Breadcrumb[] = [];

  public msgTitle: string = "";

  public msgNoAccess: string = "";
  public msgNotFound: string = "";
  public showMainContent: boolean = false;
  public disableActions: boolean = false;

  public msgRoleName: string = "";
  public msgRoleNameError: string = "";
  public msgPermissions: string = "";
  public msgFilter: string = "";
  public msgShowAll: string = "";
  public msgNoPermissionsFound: string = "";

  public formErrors: Dictionary<string> = {};
  public role: EditRoleModel = new EditRoleModel();
  public filter: string = "";

  public msgDeleteAction: string = "";
  public showDeleteAction: boolean = false;
  public msgSaveAction: string = "";

  public showDeleteModal: boolean = false;
  public msgDeleteModalTitle: string = "";
  public msgDeleteModalText: string = "";
  public msgDeleteModalDeleteAction: string = "";
  public msgDeleteModalCancelAction: string = "";
  public showDeleteFailed: boolean = false;
  public msgDeleteFailed: string = "";
  public showSaveFailed: boolean = false;
  public msgSaveFailed: string = "";
  public showSaveSuccessful: boolean = false;
  public msgSaveSuccessful: string = "";
  public showAddedSuccessful: boolean = false;
  public msgAddedSuccessful: string = "";
}
