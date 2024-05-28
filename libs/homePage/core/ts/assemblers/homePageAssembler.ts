import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import HomePageState from "../interactors/homePageState";
import HomePageModel from "../models/homePageModel";

export default class HomePageAssemblers {
  public static fromState(state: HomePageState, router: Router, i18nGateway: I18nGateway): HomePageModel {
    const model: HomePageModel = new HomePageModel();

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );

    model.labels.homePageTitle = i18nGateway.get("app.title");
    // company
    model.labels.company = i18nGateway.get("state.labels.company");
    model.labels.companyTip = i18nGateway.get("state.labels.companyTip");
    model.labels.edit = i18nGateway.get("state.labels.edit");
    model.showCompaniesMenue = state.showCompaniesMenue;

    // user
    model.labels.user = i18nGateway.get("state.labels.user");
    model.labels.userTip = i18nGateway.get("state.labels.userTip");

    // roles
    model.labels.roles = i18nGateway.get("state.labels.roles");
    model.labels.rolesTip = i18nGateway.get("state.labels.rolesTip");

    return model;
  }
}
