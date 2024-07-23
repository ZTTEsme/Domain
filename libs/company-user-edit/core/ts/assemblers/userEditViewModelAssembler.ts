import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";

import PakInformation from "../../../../roles-common/core/ts/entities/pakInformation";
import RoleListModel from "../../../../roles-common/core/ts/models/roleListModel";
import UserEditViewState from "../interactors/userEditViewState";
import CompanyConnectionModel from "../models/companyConnectionModel";
import PakLoginDataModel from "../models/pakLoginDataModel";
import RoleInCompanyModel from "../models/roleInCompanyModel";
import UserEditViewModel from "../models/userEditViewModel";

export default class UserEditViewModelAssembler {
  public static fromState(state: UserEditViewState, router: Router, i18nGateway: I18nGateway): UserEditViewModel {
    const model: UserEditViewModel = new UserEditViewModel();

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );
    if (state.isInvalidMode || state.noAccess) {
      model.breadcrumb[model.breadcrumb.length - 1].name = i18nGateway.get("user.title");
    } else {
      if (state.user && state.user.alias) {
        model.breadcrumb[model.breadcrumb.length - 1].name = state.user.alias;
      }
    }

    model.msgTitle = i18nGateway.get("common.userEdit");

    if (state.noAccess) {
      model.msgNoAccess = i18nGateway.get("common.noAccess");
      return model;
    }

    if (state.isInvalidMode) {
      model.msgNoAccess = i18nGateway.get("users.roleNotFound");
      return model;
    }

    model.showMainContent = true;
    model.disableActions = state.loading;

    model.msgFirstName = i18nGateway.get("common.firstName");
    model.msgLastName = i18nGateway.get("common.lastName");
    model.msgEmail = i18nGateway.get("common.email");

    model.firstName = state.user?.firstName || "";
    model.lastName = state.user?.lastName || "";
    model.email = state.user?.email || "";

    model.msgCompanies = i18nGateway.get("common.companies");
    model.msgCompanyName = i18nGateway.get("company.name");
    model.msgIsAdmin = i18nGateway.get("company.isAdmin");
    model.msgRoles = i18nGateway.get("company.roles");
    model.msgPakId = i18nGateway.get("company.pakId");
    model.msgAssign = i18nGateway.get("common.assign");
    model.msgUnassign = i18nGateway.get("common.unassign");
    model.msgNoRolesFound = i18nGateway.get("company.noRolesFound");
    model.msgNoPakLoginsFound = i18nGateway.get("company.noPakLoginsFound");
    model.msgUnassignPakId = i18nGateway.get("company.unassignPakId");
    model.msgSetAdmin = i18nGateway.get("company.setAdmin");
    model.msgResetAdmin = i18nGateway.get("company.resetAdmin");

    if (state.user) {
      model.companyConnections = state.user.companyConnections.map((con) => {
        return new CompanyConnectionModel({
          companyId: con.companyId!,
          companyName: UserEditViewModelAssembler.getCompanyName(con.companyId, state.companyNames, "-"),
          admin: con.admin,
          roleSummary: UserEditViewModelAssembler.getRoleSummary(con.roleIds, state.roleNames, i18nGateway),
          roles: UserEditViewModelAssembler.getRoles(state.rolesByCompany.get(con.companyId!)!, con.roleIds),
          pakIdSet: con.pakId !== undefined,
          pakSummary: con.pakId ? con.pakId : i18nGateway.get("company.noPakAssigned"),
          pakLogins: UserEditViewModelAssembler.getPakLogins(
            state.pakLoginsByCompany.get(con.companyId!)!,
            state.deviceNames,
            i18nGateway
          ),
        });
      });
    }

    model.showPakIdUpdateSucceededMsg = state.pakIdUpdateSucceeded;
    model.msgPakIdUpdateSucceeded = i18nGateway.get("company.pakIdUpdateSucceeded");
    model.showPakIdUpdateFailedMsg = state.pakIdUpdateFailed;
    model.msgPakIdUpdateFailed = i18nGateway.get("company.pakIdUpdateFailed");

    model.showRoleUpdateSucceededMsg = state.roleUpdateSucceeded;
    model.msgRoleUpdateSucceeded = i18nGateway.get("company.roleUpdateSucceeded");
    model.showRoleUpdateFailedMsg = state.roleUpdateFailed;
    model.msgRoleUpdateFailed = i18nGateway.get("company.roleUpdateFailed");

    model.showAdminFlagUpdateSucceededMsg = state.adminFlagUpdateSucceeded;
    model.msgAdminFlagUpdateSucceeded = i18nGateway.get("company.adminFlagUpdateSucceeded");
    model.showAdminFlagUpdateFailedMsg = state.adminFlagUpdateFailed;
    model.msgAdminFlagUpdateFailed = i18nGateway.get("company.adminFlagUpdateFailed");

    return model;
  }

  private static getPakLogins(
    logins: PakInformation[],
    deviceNames: Map<number, string>,
    i18nGateway: I18nGateway
  ): PakLoginDataModel[] {
    return logins.map(
      (login) =>
        new PakLoginDataModel({
          pakId: login.pakId,
          description: UserEditViewModelAssembler.getPakLoginDescription(login, deviceNames, i18nGateway),
        })
    );
  }

  private static getPakLoginDescription(
    pakLogin: PakInformation,
    deviceNames: Map<number, string>,
    i18nGateway: I18nGateway
  ): string {
    return i18nGateway.get("company.pakLoginAttempt", {
      timestamp: pakLogin.timestamp.toLocaleString(),
      deviceAlias: deviceNames.has(pakLogin.deviceId) ? deviceNames.get(pakLogin.deviceId)! : "-",
      pakId: `${pakLogin.pakId}`,
    });
  }

  private static getRoles(rolesOfCompany: RoleListModel[], roleIds: number[]): RoleInCompanyModel[] {
    return rolesOfCompany.map(
      (role) =>
        new RoleInCompanyModel({
          id: role.id,
          alias: role.alias,
          selected: roleIds.indexOf(role.id) >= 0,
        })
    );
  }

  private static getRoleSummary(roleIds: number[], roleNames: Map<number, string>, i18nGateway: I18nGateway): string {
    if (roleIds.length === 0) {
      return i18nGateway.get("company.noRolesAssigned");
    } else if (roleIds.length === 1) {
      return roleNames.get(roleIds[0]) || i18nGateway.get("company.roleNameNotFound");
    }
    return i18nGateway.get("company.multipleRoles", { numberOfRoles: `${roleIds.length}` });
  }

  private static getCompanyName(companyId: number | null, companyNames: Map<number, string>, fallback: string): string {
    if (companyId === null) {
      return fallback;
    }

    if (companyNames.has(companyId)) {
      return companyNames.get(companyId)!;
    }
    return fallback;
  }
}
