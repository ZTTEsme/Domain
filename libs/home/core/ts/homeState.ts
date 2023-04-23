import AppConfig from "qnect-sdk-web/lib/apps/core/ts/entities/appConfig";

export default class HomeState {
  public editFavorites: boolean = false;
  public favoriteApps: AppConfig[] = [];
  public isLoadingFavorites: boolean = false;

  public openFeedbackDialog: boolean = false;
  public isLoadingFeedback: boolean = false;
  public inputFeedback: string = "";
  public feedbackSentWithSuccess: boolean = false;
  public feedbackSentWithFailure: boolean = false;
}
