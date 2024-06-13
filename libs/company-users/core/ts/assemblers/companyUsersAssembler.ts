import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyUsersState from "../interactors/companyUsersState";
import CompanyUsersModel from "../models/companyUsersModel";

export default class CompanyUsersAssembler {
  public static fromState(state: CompanyUsersState, router: Router, i18nGateway: I18nGateway): CompanyUsersModel {
    const model: CompanyUsersModel = new CompanyUsersModel();
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );
    this.updateCompanyUserModel(model, state, i18nGateway);

    return model;
  }

  private static updateCompanyUserModel(
    model: CompanyUsersModel,
    state: CompanyUsersState,
    i18nGateway: I18nGateway
  ): void {
    model.isLoading = state.isLoading;

    model.companies = state.companies;
    model.showCompaniesMenue = model.companies.length > 1;
    model.selectedCompanyId = state.selectedCompanyId;
    // label
    model.labelInfo.title = i18nGateway.get("users.title");
    model.labelInfo.companyLabel = i18nGateway.get("model.labelInfo.companyLabel");
    model.labelInfo.selectTip = i18nGateway.get("model.labelInfo.selectTip");
    model.labelInfo.emailLabel = i18nGateway.get("companyUser.label.email");
    model.labelInfo.userTypeAdmin = i18nGateway.get("companyUser.label.userTypeAdmin");
    model.labelInfo.userTypeAdminExplanation = i18nGateway.get("companyUser.label.userTypeAdminExplanation");
    model.labelInfo.serverErrorInfo = i18nGateway.get("companyUser.label.serverErrorInfo");
    model.labelInfo.noDataLabel = i18nGateway.get("noDataLabel");

    model.labelInfo.addLabel = i18nGateway.get("company.btn.add");
    model.labelInfo.deleteLabel = i18nGateway.get("company.btn.delete");
    model.labelInfo.editLabel = i18nGateway.get("company.btn.edit");

    // data
    model.users = state.users;

    // table colName
    model.userTableColName.alias = i18nGateway.get("companyUser.table.alias");
    model.userTableColName.email = i18nGateway.get("companyUser.table.email");
    model.userTableColName.isAdmin = i18nGateway.get("companyUser.table.isAdmin");
    model.userTableColName.operate = i18nGateway.get("companyUser.table.operate");

    // add user
    state.dialog.msgAddUserWithSuccess = i18nGateway.get("companyUser.dialog.msgAddUserWithSuccess");
    state.dialog.msgAddUserWithFailure = i18nGateway.get("companyUser.dialog.msgAddUserWithFailure");
    state.dialog.addUserDialogTitle = i18nGateway.get("companyUser.dialog.addUserDialogTitle");
    state.dialog.submit = i18nGateway.get("companyUser.dialog.submit");
    // model.validAddUserFormErrors = state.validAddCompanyUserFormErrors;
    model.addUserFormData = state.addUserFormData;

    // delete user
    state.dialog.deleteUserDialogTitle = i18nGateway.get("companyUser.dialog.deleteUserDialogTitle");
    state.dialog.deleteUserTipInfo = i18nGateway.get("companyUser.dialog.deleteUserTipInfo");
    state.dialog.msgDeleteUserWithFailure = i18nGateway.get("companyUser.dialog.msgDeleteUserWithFailure");
    state.dialog.msgDeleteUserWithSuccess = i18nGateway.get("companyUser.dialog.msgDeleteUserWithSuccess");

    model.dialog = state.dialog;
    this.updateCompanyUserInfos(model);
  }

  private static updateCompanyUserInfos(model: CompanyUsersModel): void {
    model.users.forEach((user) => {
      if (user.alias === null) {
        user.alias = "N/A";
      }
    });
  }
}
