import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanySiteGateway from "qnect-sdk-web/lib/company-site/core/ts/gateways/companySiteGateway";
import CompanySiteGatewayMock from "qnect-sdk-web/lib/company-site/core/ts/gateways/companySiteGatewayMock";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanySiteInteractor from "../../../libs/companysite/core/ts/interactors/companySiteInteractor";
import CompanySiteComponent from "../../../libs/companysite/vue/ts/companySiteComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class CompanySiteModule implements Module {
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
    return CompanySiteModule.name;
  }

  public async load(): Promise<void> {
    let companyGateway: CompanyGateway;
    let sitesGateway: CompanySiteGateway;
    if (ProjectUtil.isMock()) {
      companyGateway = new CompanyGatewayMock();
      sitesGateway = new CompanySiteGatewayMock();
    } else {
      companyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
      sitesGateway = new RestCompanySiteGateway(this.authModule.getRestClientProvider());
    }

    this.routerModule.getRouter().register(
      new Route({
        name: "sites",
        title: this.i18nModule.getI18nGateway().get("companySite.router.name"),
        urlPattern: "sites",
        parent: this.routerModule.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: CompanySiteComponent,
        interactor: new CompanySiteInteractor(
          this.routerModule.getRouter(),
          this.i18nModule.getI18nGateway(),
          sitesGateway,
          companyGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
