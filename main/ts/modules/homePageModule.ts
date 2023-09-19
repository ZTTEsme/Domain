import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import HomePageGateway from "../../../libs/homePage/core/ts/gateway/homePageGateway";
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
    const homePageGateway: HomePageGateway = new HomePageGateway(this.authModule.getRestClientProvider());

    this.routerModule.getRouter().register(
      new Route({
        name: "home",
        title: this.i18n.getI18nGateway().get("app.title"),
        urlPattern: "/",
      }),
      new VueRouteHandler({
        controller: HomePageComponent,
        interactor: new HomePageInteractor(
          this.routerModule.getRouter(),
          this.i18nModule.getI18nGateway(),
          homePageGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    // do nothing
  }
}
