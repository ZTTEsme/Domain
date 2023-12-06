import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyUsersInteractor from "../../../libs/companyusers/core/ts/interactors/companyUsersInteractor";
import CompanyUsersComponent from "../../../libs/companyusers/vue/ts/companyUsersComponent";
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
    if (ProjectUtil.isMock()) {
      companyGateway = new CompanyGatewayMock();
    } else {
      companyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
    }

    this.router.getRouter().register(
      new Route({
        name: "users",
        title: this.i18nModule.getI18nGateway().get("companyUser.router.name"),
        urlPattern: "users",
        parent: this.router.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: CompanyUsersComponent,
        interactor: new CompanyUsersInteractor(
          this.router.getRouter(),
          this.i18nModule.getI18nGateway(),
          companyGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
