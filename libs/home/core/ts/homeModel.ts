import AppLinkModel from "qnect-sdk-web/lib/apps/core/ts/models/appLinkModel";

export default class HomeModel {
  public msgFavorites: string = "";
  public msgEditFavorites: string = "";
  public favoriteApps: AppLinkModel[] = [];
  public showFavoritesRemoveAction: boolean = false;
  public showFavoriteLinks: boolean = false;
  public disableFavoriteActions: boolean = false;

  public msgFeedback: string = "";
  public showFeedbackDialog: boolean = false;
  public msgFeedbackLabel: string = "";
  public msgSendFeedback: string = "";
  public inputFeedback: string = "";
  public showFeedbackSuccessMessage: boolean = false;
  public showFeedbackFailureMessage: boolean = false;
  public disableFeedback: boolean = false;
  public msgSendFeedbackWithSuccess: string = "";
  public msgSendFeedbackWithFailure: string = "";
}
