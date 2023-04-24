import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import RouterModule from "./routerModule";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import I18nModule from "./i18nModule";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import CompanySiteComponent from "../../../libs/companysite/vue/ts/companySiteComponent";
import CompanySiteInteractor from "../../../libs/companysite/core/ts/interactors/companySiteInteractor";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";

export default class CompanySiteModule implements Module {
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
    return CompanySiteModule.name;
  }

  public async load(): Promise<void> {

    let gateway: RestCompanySiteGateway;
    let restCompanyGateway: RestCompanyGateway;
    gateway = new RestCompanySiteGateway(this.authModule.getRestClientProvider());
    restCompanyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
    this.routerModule.getRouter().register(
      new Route({
        name: "CompanySite",
        title: "Manage",
        urlPattern: "/companySite/manage/:id"
      }),
      new VueRouteHandler({
        controller: CompanySiteComponent,
        interactor: new CompanySiteInteractor(
          this.routerModule.getRouter(),
          this.i18nModule.getI18nGateway(),
          gateway,
          restCompanyGateway),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {

  }
}
