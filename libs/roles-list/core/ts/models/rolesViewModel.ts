import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import DropdownSelectModel from "./dropdownSelectModel";
import RoleModel from "./roleModel";

export default class RolesViewModel {
  public breadcrumb: Breadcrumb[] = [];

  public msgTitle: string = "";
  public msgCompanies: string = "";
  public msgNoAccess: string = "";
  public showEditActions: boolean = false;
  public showMainContent: boolean = false;

  public msgAddNewRole: string = "";
  public addNewRoleLink: string = "";

  public msgDeletedSuccessful: string = "";
  public showDeletedSuccessful: boolean = false;

  public msgRole: string = "";
  public msgNoRolesFound: string = "";
  public msgEdit: string = "";
  public roles: RoleModel[] = [];

  public companies: DropdownSelectModel<number>[] = [];
  public selectedCompanyId: number | undefined = undefined;
  public showCompaniesMenue: boolean = false;

  public showGetRolesFailedMsg: boolean = false;
  public msgGetRolesFailed: string = "";
}
