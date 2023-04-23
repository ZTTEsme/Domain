import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import RouterModule from "./routerModule";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import I18nModule from "./i18nModule";
import CompanyInteractor from "../../../libs/company/core/ts/interactors/companyInteractor";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyComponent from "../../../libs/company/vue/ts/companyComponent";

export default class CompanyModule implements Module {
  private authModule: any;
  private readonly i18nModule: I18nModule;
  private readonly routerModule: RouterModule;


  public constructor(
    private auth: AuthModule,
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

    let companyGateway: RestCompanyGateway;
    companyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
    this.routerModule.getRouter().register(
      new Route({
        name: "Company",
        title: "Manage",
        urlPattern: "/company/manage"
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

  }
}
