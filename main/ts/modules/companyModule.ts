import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyInteractor from "../../../libs/company/core/ts/interactors/companyInteractor";
import CompanyComponent from "../../../libs/company/vue/ts/companyComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class CompanyModule implements Module {
  public constructor(
    private readonly authModule: AuthModule,
    private readonly routerModule: RouterModule,
    private readonly i18nModule: I18nModule
  ) {}

  public getName(): string {
    return CompanyModule.name;
  }

  public async load(): Promise<void> {
    let companyGateway: CompanyGateway;
    if (ProjectUtil.isMock()) {
      companyGateway = new CompanyGatewayMock();
    } else {
      companyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
    }

    this.routerModule.getRouter().register(
      new Route({
        name: "companies",
        title: this.i18nModule.getI18nGateway().get("company.router.name"),
        urlPattern: "companies",
        parent: this.routerModule.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: CompanyComponent,
        interactor: new CompanyInteractor(
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
