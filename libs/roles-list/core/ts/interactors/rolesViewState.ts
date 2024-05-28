import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import RoleListModel from "../../../../roles-common/core/ts/models/roleListModel";

export default class RolesViewState {
  public noAccess: boolean = false;
  public noModifyAccess: boolean = false;
  public deletedSuccessful: boolean = false;

  public roles: RoleListModel[] = [];
  public companies: Company[] = [];
  public selectedCompanyId: number | undefined = undefined;

  public getRolesFailed: boolean = false;
}
