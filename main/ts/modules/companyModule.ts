import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyInteractor from "../../../libs/company/core/ts/interactors/companyInteractor";
import CompanyComponent from "../../../libs/company/vue/ts/companyComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class CompanyModule implements Module {
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
    return CompanyModule.name;
  }

  public async load(): Promise<void> {

    const companyGateway: RestCompanyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
    this.routerModule.getRouter().register(
      new Route({
        name: "home",
        title: this.i18nModule.getI18nGateway().get("company.router.name"),
        urlPattern: "/companies"
      }),
      new VueRouteHandler({
        controller: CompanyComponent,
        interactor: new CompanyInteractor(
          this.routerModule.getRouter(),
          this.i18nModule.getI18nGateway(),
          companyGateway),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
