import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanySiteUsersState from "../interactors/companySiteUsersState";
import CompanySiteUsersModel from "../models/companySiteUsersModel";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import CommonUtils from "../../../../common/utils/ts/commonUtils";

export default class CompanySiteUsersAssembler {
  public static fromState(
    state: CompanySiteUsersState,
    router: Router,
    i18nGateway: I18nGateway
  ):CompanySiteUsersModel{
    const model:CompanySiteUsersModel = new CompanySiteUsersModel();
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);
    this.updateCompanySiteUserModel(model,state,i18nGateway);

    return model;
  }

  private static updateCompanySiteUserModel(model:CompanySiteUsersModel,state:CompanySiteUsersState, i18nGateway: I18nGateway){
    model.isLoading = state.isLoading;

    // label
    model.labelInfo.emailLabel = i18nGateway.get("companySiteUser.label.email");
    model.labelInfo.roleLabel = i18nGateway.get("companySiteUser.label.role");
    model.labelInfo.ADMINISTRATOR = i18nGateway.get("companySiteUser.label.ADMINISTRATOR");
    model.labelInfo.USER = i18nGateway.get("companySiteUser.label.USER");
    model.labelInfo.serverErrorInfo = i18nGateway.get("companySiteUser.label.serverErrorInfo");
    model.labelInfo.noDataLabel = i18nGateway.get("noDataLabel");

    // table pagination
    model.pageInfo = state.pageInfo;
    model.companySiteUsers = state.companySiteUsers;

    // table colName
    model.userTableColName.alias = i18nGateway.get("companySiteUser.table.alias");
    model.userTableColName.email = i18nGateway.get("companySiteUser.table.email");
    model.userTableColName.role = i18nGateway.get("companySiteUser.table.role");
    model.userTableColName.operate = i18nGateway.get("companySiteUser.table.operate");

    // add User
    state.dialog.msgAddUserWithSuccess = i18nGateway.get("companySiteUser.dialog.msgAddUserWithSuccess");
    state.dialog.msgAddUserWithFailure = i18nGateway.get("companySiteUser.dialog.msgAddUserWithFailure");
    state.dialog.addUserDialogTitle = i18nGateway.get("companySiteUser.dialog.addUserDialogTitle");
    state.dialog.submit = i18nGateway.get("companySiteUser.dialog.submit");
    model.validAddUserFormErrors = state.validAddCompanySiteUserFormErrors;

    // delete user
    state.dialog.deleteUserDialogTitle = i18nGateway.get("companySiteUser.dialog.deleteUserDialogTitle");
    state.dialog.deleteUserTipInfo = i18nGateway.get("companySiteUser.dialog.deleteUserTipInfo");
    state.dialog.msgDeleteUserWithFailure = i18nGateway.get("companySiteUser.dialog.msgDeleteUserWithFailure");
    state.dialog.msgDeleteUserWithSuccess = i18nGateway.get("companySiteUser.dialog.msgDeleteUserWithSuccess");

    model.dialog = state.dialog;
    this.updateCompanySiteUserInfos(model);
  }

  private static updateCompanySiteUserInfos(model:CompanySiteUsersModel){
    model.pageResultForUsers = CommonUtils.getPageData(model.companySiteUsers,model.pageInfo.pageNo,model.pageInfo.pageSize);
  }
}
