import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanySiteUsersState from "../interactors/companySiteUsersState";
import CompanySiteUsersModel from "../models/companySiteUsersModel";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";

export default class CompanySiteUsersAssembler {
  public static fromState(
    state: CompanySiteUsersState,
    router: Router,
    i18nGateway: I18nGateway
  ):CompanySiteUsersModel{
    const model:CompanySiteUsersModel = new CompanySiteUsersModel();
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);

    model.isLoading = state.isLoading;
    return model;
  }
}
