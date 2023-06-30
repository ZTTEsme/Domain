import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import HomePageAssemblers from "../assemblers/homePageAssembler";
import HomePageGateway from "../gateway/homePageGateway";
import HomePagePresenter from "./homePagePresenter";
import HomePageState from "./homePageState";

export default class HomePageInteractor extends ViewInteractor<HomePagePresenter>{

  public presenter: HomePagePresenter | null = null;

  public readonly state: HomePageState =new HomePageState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly homePageGateway: HomePageGateway
  ) {
    super(router);
    this.i18nGateway = i18nGateway;
    this.homePageGateway = homePageGateway;
  }

  public onLoad(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public startPresenting(presenter: HomePagePresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  private updateView():void {
    this.presenter?.updateView(HomePageAssemblers.fromState(this.state,this.router,this.i18nGateway));
  }

}
