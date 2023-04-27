import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanySiteUsersState from "../interactors/companySiteUsersState";
import CompanySiteUsersModel from "../models/companySiteUsersModel";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanySiteModel from "../../../../companysite/core/ts/models/companySiteModel";

export default class CompanySiteUsersAssembler {
  public static fromState(
    state: CompanySiteUsersState,
    router: Router,
    i18nGateway: I18nGateway
  ):CompanySiteUsersModel{
    const model:CompanySiteUsersModel = new CompanySiteUsersModel();
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);
    this.updateCompanySiteUserModel(model,state);

    return model;
  }

  private static updateCompanySiteUserModel(model:CompanySiteUsersModel,state:CompanySiteUsersState){
    model.isLoading = state.isLoading;

    // table colName
    model.userTableColName.alias = "Alias"
    model.userTableColName.email = "Email"
    model.userTableColName.role = "Role";
    model.userTableColName.operate = "Operate";

    // table pagination
    model.pageInfo = state.pageInfo;
    model.companySiteUsers = state.companySiteUsers;
    this.updateCompanySiteUserInfos(model);

    // add User
    state.dialog.msgAddUserWithSuccess="Success to add user"
    state.dialog.msgAddUserWithFailure="Failed to add user"
    state.dialog.addUserDialogTitle="Add CompanySite User";
    state.dialog.submit = "submit";
    model.validAddUserFormErrors = state.validAddCompanySiteUserFormErrors;

    // delete user
    state.dialog.deleteUserDialogTitle="Delete User"
    state.dialog.deleteUserTipInfo="Sure to delete user?"
    state.dialog.msgDeleteUserWithFailure = "Failed to delete user";
    state.dialog.msgDeleteUserWithSuccess = "Success to delete user";

    model.dialog = state.dialog;

  }

  private static updateCompanySiteUserInfos(model:CompanySiteUsersModel){
    model.pageResultForUsers = CommonUtils.getPageData(model.companySiteUsers,model.pageInfo.pageNo,model.pageInfo.pageSize);
  }
}
