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
import CompanySiteUsersInteractor from "../../../libs/companysiteusers/core/ts/interactors/companySiteUsersInteractor";
import CompanySiteUsersComponent from "../../../libs/companysiteusers/vue/ts/companySiteUsersComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class CompanySiteUsersModule implements Module {
  public constructor(
    private readonly authModule: AuthModule,
    private readonly router: RouterModule,
    private readonly i18nModule: I18nModule
  ) {}

  public getName(): string {
    return CompanySiteUsersModule.name;
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

    this.router.getRouter().register(
      new Route({
        name: "users",
        title: this.i18nModule.getI18nGateway().get("companySiteUser.router.name"),
        urlPattern: "users",
        parent: this.router.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: CompanySiteUsersComponent,
        interactor: new CompanySiteUsersInteractor(
          this.router.getRouter(),
          this.i18nModule.getI18nGateway(),
          companyGateway,
          sitesGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
