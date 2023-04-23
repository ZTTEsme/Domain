import AppLinkModel from "qnect-sdk-web/lib/apps/core/ts/models/appLinkModel";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import HomeModel from "./homeModel";
import HomeState from "./homeState";

export default class HomeModelAssembler {
  public constructor(private readonly i18n: I18nGateway) {}

  public fromState(state: HomeState): HomeModel {
    const model: HomeModel = new HomeModel();

    this.addFavorites(model, state);
    this.addFeedbackDialog(model, state);

    return model;
  }
  private addFeedbackDialog(model: HomeModel, state: HomeState) {
    model.msgFeedback = this.i18n.get("home.feedback");
    model.showFeedbackDialog = state.openFeedbackDialog;
    model.msgFeedbackLabel = this.i18n.get("home.typeYourFeedbackHere");
    model.msgSendFeedback = this.i18n.get("home.submitYourFeedback");
    model.inputFeedback = state.inputFeedback;
    model.disableFeedback = state.isLoadingFeedback;
    model.showFeedbackSuccessMessage = state.feedbackSentWithSuccess;
    model.showFeedbackFailureMessage = state.feedbackSentWithFailure;
    model.msgSendFeedbackWithSuccess = this.i18n.get("home.sentFeedback");
    model.msgSendFeedbackWithFailure = this.i18n.get("home.failedToSendFeedback");
  }

  private addFavorites(model: HomeModel, state: HomeState) {
    model.msgFavorites = state.editFavorites ? this.i18n.get("home.editingFavorites") : this.i18n.get("home.favorites");
    model.msgEditFavorites = this.i18n.get("home.editFavorites");
    model.showFavoritesRemoveAction = state.editFavorites;
    model.showFavoriteLinks = !state.editFavorites;

    model.favoriteApps = state.favoriteApps
      .sort((a, b) => (a.positionInCategory > b.positionInCategory ? 1 : -1))
      .sort((a, b) => (a.categoryId > b.categoryId ? 1 : -1))
      .map((app) => AppLinkModel.fromAppConfig(app, this.i18n.getLanguage()));

    model.disableFavoriteActions = state.isLoadingFavorites;
  }
}
