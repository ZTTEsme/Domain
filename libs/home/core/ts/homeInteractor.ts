import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import AppConfig from "qnect-sdk-web/lib/apps/core/ts/entities/appConfig";
import AppConfigGateway from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import FeedbackGateway from "../../../feedback/core/ts/gateways/feedbackGateway";
import HomeModelAssembler from "./homeModelAssembler";
import HomePresenter from "./homePresenter";
import HomeState from "./homeState";

export default class HomeInteractor extends ViewInteractor<HomePresenter> {
  private readonly state: HomeState = new HomeState();
  private presenter: HomePresenter | null = null;
  private readonly assembler: HomeModelAssembler;
  private readonly feedbackGateway: FeedbackGateway;
  private readonly appConfigGateway: AppConfigGateway;

  public constructor(
    router: Router,
    i18n: I18nGateway,
    feedbackGateway: FeedbackGateway,
    appConfigGateway: AppConfigGateway
  ) {
    super(router);
    this.assembler = new HomeModelAssembler(i18n);
    this.feedbackGateway = feedbackGateway;
    this.appConfigGateway = appConfigGateway;
  }

  public async onLoad(): Promise<void> {
    await this.updateFavoriteApps();
  }

  public async onUnload(): Promise<void> {
    // actions before unloading
  }

  public startPresenting(presenter: HomePresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async updateFavoriteApps(): Promise<void> {
    // Later on we will show favorites here,
    // but as long as we only have a few apps in total,
    // we load all available apps.
    // this.state.favoriteApps = await this.appConfigGateway.getFavoriteApps();
    this.state.favoriteApps = await this.appConfigGateway.getApps();
  }

  public toggleEditFavorites(): void {
    this.state.editFavorites = !this.state.editFavorites;
    this.updateView();
  }

  public async removeFavorite(link: string): Promise<void> {
    this.state.isLoadingFavorites = true;
    this.updateView();

    const appLink: AppConfig | undefined = this.state.favoriteApps.find((item) => item.uri === link);
    if (appLink !== undefined) {
      this.state.favoriteApps = await this.appConfigGateway.removeFavoriteApp(appLink);
    }

    this.state.isLoadingFavorites = false;
    this.updateView();
  }

  public openFeedbackDialog(): void {
    this.state.openFeedbackDialog = true;
    this.state.feedbackSentWithSuccess = false;
    this.state.feedbackSentWithFailure = false;
    this.updateView();
  }

  public closeFeedbackDialog(): void {
    if (this.state.isLoadingFeedback) {
      return;
    }
    this.state.openFeedbackDialog = false;
    this.updateView();
  }

  public async sendFeedback(feedbackText: string): Promise<void> {
    this.state.inputFeedback = feedbackText;

    this.state.isLoadingFeedback = true;
    this.state.feedbackSentWithSuccess = false;
    this.state.feedbackSentWithFailure = false;
    this.updateView();

    try {
      await this.feedbackGateway.sendFeedback(feedbackText);
      this.state.feedbackSentWithSuccess = true;
      this.state.inputFeedback = "";
    } catch (error) {
      this.state.feedbackSentWithFailure = true;
    }

    this.state.isLoadingFeedback = false;
    this.updateView();
  }

  private updateView(): void {
    this.presenter?.updateView(this.assembler.fromState(this.state));
  }
}
