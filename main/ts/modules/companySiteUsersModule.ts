import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import CompanySiteUsersComponent from "../../../libs/companysiteusers/vue/ts/companySiteUsersComponent";
import CompanySiteUsersInteractor from "../../../libs/companysiteusers/core/ts/interactors/companySiteUsersInteractor";


export default class CompanySiteUsersModule implements Module {

  public constructor(
    private auth: AuthModule,
    private readonly router: RouterModule,
    private readonly i18nModule: I18nModule
  ) {
  }

  public getName(): string {
    return CompanySiteUsersModule.name;
  }

  public async load(): Promise<void> {

    let gateway: RestCompanySiteGateway = new RestCompanySiteGateway(this.auth.getRestClientProvider())
    this.router.getRouter().register(
      new Route({
        name: "User",
        title: this.i18nModule.getI18nGateway().get("companySiteUser.router.name"),
        urlPattern: ":companySiteId/users",
        parent:this.router.getRouter().getRouteByName("CompanySite")
      }),
      // /company/manage/companySite/manage/:id/user/manage/:companySiteId
      new VueRouteHandler({
        controller: CompanySiteUsersComponent,
        interactor: new CompanySiteUsersInteractor(
          this.router.getRouter(),
          this.i18nModule.getI18nGateway(),
          gateway),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {

  }

}
