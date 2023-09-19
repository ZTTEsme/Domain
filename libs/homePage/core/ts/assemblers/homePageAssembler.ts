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

    state.labels.homePageTitle = i18nGateway.get("app.title");
    // company
    state.labels.company = i18nGateway.get("state.labels.company");
    state.labels.companyTip = i18nGateway.get("state.labels.companyTip");
    state.labels.edit = i18nGateway.get("state.labels.edit");

    // site
    state.labels.site = i18nGateway.get("state.labels.site");
    state.labels.siteTip = i18nGateway.get("state.labels.siteTip");

    // user
    state.labels.user = i18nGateway.get("state.labels.user");
    state.labels.userTip = i18nGateway.get("state.labels.userTip");

    model.labels = state.labels;

    return model;
  }
}
