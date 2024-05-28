import ValidationError from "qnect-sdk-web/lib/common/core/ts/entities/validationError";
import PermissionModel from "../../../../roles-common/core/ts/models/permissionModel";
import EditRoleModel from "../models/editRoleModel";

export default class RolesEditViewState {
  public noAccess: boolean = false;
  public loading: boolean = false;

  public userRoleIdStr: string | undefined;
  public userRoleId: number | undefined;
  public isNewMode: boolean = false;
  public isEditMode: boolean = false;
  public isInvalidMode: boolean = false;
  public companyId: number | undefined;

  public permissions: PermissionModel[] = [];
  public role: EditRoleModel = new EditRoleModel();
  public roleNameValid: boolean = true;
  public filter: string = "";

  public validationErrors: ValidationError[] = [];

  public deleteRequested: boolean = false;
  public deleteFailed: boolean = false;

  public saveFailed: boolean = false;
  public saveSuccessful: boolean = false;
  public addedSuccessful: boolean = false;
}
