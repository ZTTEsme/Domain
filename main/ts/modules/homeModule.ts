import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import AppConfigGateway from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGateway";
import AppConfigGatewayMock from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGatewayMock";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import FeedbackGateway from "../../../libs/feedback/core/ts/gateways/feedbackGateway";
import FeedbackGatewayMock from "../../../libs/feedback/core/ts/gateways/feedbackGatewayMock";
import HomeInteractor from "../../../libs/home/core/ts/homeInteractor";
import HomeController from "../../../libs/home/vue/ts/homeController";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class HomeModule implements Module {
  private homeInteractor!: HomeInteractor;

  public constructor(private readonly routerModule: RouterModule, private readonly i18nModule: I18nModule) {}

  public getName(): string {
    return HomeModule.name;
  }

  public getHomeInteractor(): HomeInteractor {
    return this.homeInteractor;
  }

  public async load(): Promise<void> {
    const appConfigGateway: AppConfigGateway = new AppConfigGatewayMock();
    const feedbackGateway: FeedbackGateway = new FeedbackGatewayMock();
    this.homeInteractor = new HomeInteractor(
      this.routerModule.getRouter(),
      this.i18nModule.getI18nGateway(),
      feedbackGateway,
      appConfigGateway
    );

    this.routerModule.getRouter().register(
      new Route({
        name: "home",
        title: "Home",
        urlPattern: "/",
      }),
      new VueRouteHandler({
        controller: HomeController,
        interactor: this.homeInteractor,
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    // do nothing
  }
}
