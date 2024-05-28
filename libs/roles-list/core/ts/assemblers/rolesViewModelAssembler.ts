import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import i18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import RolesViewState from "../interactors/rolesViewState";
import DropdownSelectModel from "../models/dropdownSelectModel";
import RoleModel from "../models/roleModel";
import RolesViewModel from "../models/rolesViewModel";

export default class RolesViewModelAssembler {
  public static fromState(state: RolesViewState, router: Router, i18nGateway: i18nGateway): RolesViewModel {
    const model: RolesViewModel = new RolesViewModel();

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );

    model.msgTitle = i18nGateway.get("common.roles");
    model.msgCompanies = i18nGateway.get("company.title");
    model.msgNoAccess = state.noAccess ? i18nGateway.get("common.noAccess") : "";

    model.showMainContent = !state.noAccess;
    model.showEditActions = !state.noModifyAccess;

    model.msgNoRolesFound = state.roles.length === 0 ? i18nGateway.get("role.noRolesFound") : "";
    model.msgAddNewRole = i18nGateway.get("users.addNewRole");
    model.addNewRoleLink = router.getFullUriOfRouteByName(
      "edit-role",
      new Map([["identifier", "new"]]),
      new Map([["companyId", `${state.selectedCompanyId}`]])
    );

    model.showDeletedSuccessful = state.deletedSuccessful;
    model.msgDeletedSuccessful = i18nGateway.get("common.deletedSuccessful");

    model.showGetRolesFailedMsg = state.getRolesFailed;
    model.msgGetRolesFailed = i18nGateway.get("role.getRolesFailed");

    this.addCompaniesData(state, model);
    this.addRoleData(state, model, router, i18nGateway);

    return model;
  }

  private static addCompaniesData(state: RolesViewState, model: RolesViewModel) {
    model.companies = state.companies.map(
      (company) =>
        new DropdownSelectModel<number>({
          value: company.id !== null ? company.id : undefined,
          name: company.alias,
        })
    );
    model.showCompaniesMenue = model.companies.length > 1;
    model.selectedCompanyId = state.selectedCompanyId;
  }

  private static addRoleData(
    state: RolesViewState,
    model: RolesViewModel,
    router: Router,
    i18nGateway: i18nGateway
  ): void {
    model.msgRole = i18nGateway.get("role.name");
    model.msgEdit = i18nGateway.get("common.edit");

    model.roles = state.roles.map(
      (role) =>
        new RoleModel({
          alias: role.alias,
          editLink: router.getFullUriOfRouteByName(
            "edit-role",
            new Map([["identifier", `${role.id}`]]),
            new Map([["companyId", `${state.selectedCompanyId}`]])
          ),
        })
    );
  }
}
