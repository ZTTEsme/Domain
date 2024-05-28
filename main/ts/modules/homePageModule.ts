import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import HomePageInteractor from "../../../libs/homePage/core/ts/interactors/homePageInteractor";
import HomePageComponent from "../../../libs/homePage/vue/homePageComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class HomePageModule implements Module {
  private readonly authModule: AuthModule;
  private readonly i18nModule: I18nModule;
  private readonly routerModule: RouterModule;

  public constructor(
    private readonly auth: AuthModule,
    private readonly router: RouterModule,
    private readonly i18n: I18nModule
  ) {
    this.authModule = auth;
    this.routerModule = router;
    this.i18nModule = i18n;
  }

  public getName(): string {
    return HomePageModule.name;
  }

  public async load(): Promise<void> {
    const companyGateway: CompanyGateway = ProjectUtil.isMock()
      ? new CompanyGatewayMock()
      : new RestCompanyGateway(this.authModule.getRestClientProvider());

    this.routerModule.getRouter().register(
      new Route({
        name: "home",
        title: this.i18nModule.getI18nGateway().get("app.title"),
        urlPattern: "/",
      }),
      new VueRouteHandler({
        controller: HomePageComponent,
        interactor: new HomePageInteractor(
          this.routerModule.getRouter(),
          this.i18nModule.getI18nGateway(),
          companyGateway,
          this.authModule.getUserEnvironmentGateway()
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    // do nothing
  }
}
