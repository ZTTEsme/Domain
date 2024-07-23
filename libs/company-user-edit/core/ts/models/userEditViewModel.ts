import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import CompanyConnectionModel from "./companyConnectionModel";

export default class UserEditViewModel {
  public breadcrumb: Breadcrumb[] = [];

  public msgTitle: string = "";

  public msgNoAccess: string = "";
  public msgNotFound: string = "";
  public showMainContent: boolean = false;
  public disableActions: boolean = false;

  public msgFirstName: string = "";
  public msgLastName: string = "";
  public msgEmail: string = "";

  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";

  public msgCompanies: string = "";
  public msgCompanyName: string = "";
  public msgIsAdmin: string = "";
  public msgRoles: string = "";
  public msgNoRolesFound: string = "";
  public msgPakId: string = "";
  public msgNoPakLoginsFound: string = "";
  public msgAssign: string = "";
  public msgUnassign: string = "";
  public msgUnassignPakId: string = "";
  public msgSetAdmin: string = "";
  public msgResetAdmin: string = "";
  public companyConnections: CompanyConnectionModel[] = [];

  public showPakIdUpdateSucceededMsg: boolean = false;
  public msgPakIdUpdateSucceeded: string = "";
  public showPakIdUpdateFailedMsg: boolean = false;
  public msgPakIdUpdateFailed: string = "";

  public showRoleUpdateSucceededMsg: boolean = false;
  public msgRoleUpdateSucceeded: string = "";
  public showRoleUpdateFailedMsg: boolean = false;
  public msgRoleUpdateFailed: string = "";

  public showAdminFlagUpdateSucceededMsg: boolean = false;
  public msgAdminFlagUpdateSucceeded: string = "";
  public showAdminFlagUpdateFailedMsg: boolean = false;
  public msgAdminFlagUpdateFailed: string = "";
}
