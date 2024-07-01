import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import ValidationUtil from "qnect-sdk-web/lib/common/core/ts/validationUtil";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyUser from "qnect-sdk-web/lib/company/core/ts/entities/companyUser";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyListModel from "../../../../company/core/ts/models/companyListModel";
import CompanyUserModel from "../../../../company/core/ts/models/companyUserModel";
import UserInputModel from "../../../../company/core/ts/models/userInputModel";
import CompanyUsersState from "../interactors/companyUsersState";
import CompanyUsersModel from "../models/companyUsersModel";

export default class CompanyUsersAssembler {
  public static fromState(state: CompanyUsersState, router: Router, i18nGateway: I18nGateway): CompanyUsersModel {
    const model: CompanyUsersModel = new CompanyUsersModel();

    this.addBreadcrumb(model, i18nGateway, router);
    this.addFilter(state, model, i18nGateway);
    this.addInviteUserAction(model, i18nGateway);
    this.addUsersTable(state, model, i18nGateway, router);
    this.addUserDialog(state, model, i18nGateway);
    this.addRemoveUserDialog(state, model, i18nGateway);

    return model;
  }

  private static addBreadcrumb(model: CompanyUsersModel, i18nGateway: I18nGateway, router: Router) {
    model.msgTitle = i18nGateway.get("users.title");
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );
  }

  private static addFilter(state: CompanyUsersState, model: CompanyUsersModel, i18nGateway: I18nGateway) {
    model.showLoadingIndicator = state.isLoading;
    model.msgFilterTitle = i18nGateway.get("model.labelInfo.companyLabel");
    model.msgNoSelectedCompany = i18nGateway.get("model.labelInfo.selectTip");
    model.selectedCompanyId = state.selectedCompanyId;
    model.companies = this.companiesToModels(state.companies);
    model.showSelectCompanyErrorMessage = state.companyLoadedWithFailure;
    model.msgSelectCompanyErrorMessage = i18nGateway.get("companyUser.label.serverErrorInfo");
  }

  private static addInviteUserAction(model: CompanyUsersModel, i18nGateway: I18nGateway) {
    model.msgInviteUserAction = i18nGateway.get("company.btn.add");
  }

  private static addUsersTable(
    state: CompanyUsersState,
    model: CompanyUsersModel,
    i18nGateway: I18nGateway,
    router: Router
  ) {
    model.msgUserAlias = i18nGateway.get("companyUser.table.alias");
    model.msgUserEmail = i18nGateway.get("companyUser.table.email");
    model.msgUserIsAdmin = i18nGateway.get("companyUser.table.isAdmin");
    model.msgUserActions = i18nGateway.get("companyUser.table.operate");
    model.msgUserIsAdminTrue = i18nGateway.get("companyUser.table.isAdminTrue");
    model.msgUserIsAdminFalse = i18nGateway.get("companyUser.table.isAdminFalse");
    model.msgNoUsers = i18nGateway.get("noDataLabel");
    model.users = this.usersToModels(state.users, router);
    model.msgUserEditAction = i18nGateway.get("company.btn.edit");
    model.msgUserDeleteAction = i18nGateway.get("company.btn.delete");
  }

  private static addUserDialog(state: CompanyUsersState, model: CompanyUsersModel, i18nGateway: I18nGateway) {
    model.showUserDialog = state.addUserDialogOpen;
    model.msgUserDialog = i18nGateway.get("companyUser.dialog.addUserDialogTitle");
    model.msgUserIsAdminExplanation = i18nGateway.get("companyUser.label.userTypeAdminExplanation");

    model.showAddUserSuccessMessage = state.userAddedWithSuccess;
    model.msgAddUserSuccessMessage = i18nGateway.get("companyUser.dialog.msgAddUserWithSuccess");
    model.showAddUserErrorMessage = state.userAddedWithFailure;
    model.msgAddUserErrorMessage = i18nGateway.get("companyUser.dialog.msgAddUserWithFailure");

    model.msgHint = i18nGateway.get("common.hint");
    model.msgHintUserRoles = i18nGateway.get("companyUser.defaultRolesAdded");

    model.userInput = new UserInputModel(state.addUserInput);
    model.msgUserSaveAction = i18nGateway.get("companyUser.dialog.submit");
    model.formErrors = ValidationUtil.validationErrorsToObject(state.addUserInput.validationErrors, i18nGateway);
  }

  static addRemoveUserDialog(state: CompanyUsersState, model: CompanyUsersModel, i18nGateway: I18nGateway) {
    model.showUserRemoveDialog = state.removeUserDialogOpen;
    model.msgRemoveUserDialog = i18nGateway.get("companyUser.dialog.deleteUserDialogTitle");
    model.msgRemoveUserDialogText = i18nGateway.get("companyUser.dialog.deleteUserTipInfo");

    model.showRemoveSuccessMessage = state.userRemovedWithSuccess;
    model.msgRemoveSuccessMessage = i18nGateway.get("companyUser.dialog.msgDeleteUserWithSuccess");
    model.showRemoveErrorMessage = state.userRemovedWithFailure;
    model.msgRemoveErrorMessage = i18nGateway.get("companyUser.dialog.msgDeleteUserWithFailure");
  }

  private static companiesToModels(companies: Company[]): CompanyListModel[] {
    return companies.map((company) => {
      return new CompanyListModel({ id: company.id, alias: company.alias });
    });
  }

  private static usersToModels(users: CompanyUser[], router: Router): CompanyUserModel[] {
    return users.map((user) => {
      return new CompanyUserModel({
        id: user.id || undefined,
        alias: user.alias,
        email: user.email,
        isAdmin: user.admin,
        link: user.id ? router.getFullUriOfRouteByName("user-edit", new Map([["identifier", user.id.toString()]])) : "",
      });
    });
  }
}
