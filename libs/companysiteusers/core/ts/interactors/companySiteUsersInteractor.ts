import CompanySitePresenter from "../../../../companysite/core/ts/interactors/companySitePresenter";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanySiteUsersPresenter from "./companySiteUsersPresenter";
import CompanySiteUsersAssembler from "../assemblers/companySiteUsersAssembler";
import CompanySiteState from "../../../../companysite/core/ts/interactors/companySiteState";
import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import CompanySiteUsersModel from "../models/companySiteUsersModel";

export default class CompanySiteUsersInteractor extends ViewInteractor<CompanySiteUsersPresenter> {

  private presenter: CompanySiteUsersPresenter | null = null;
  private readonly state: CompanySiteState = new CompanySiteState();

  public constructor(
    router: Router,
    private i18nGateway: I18nGateway,
    private gateWay: RestCompanySiteGateway,
  ) {
    super(router);
  }

  startPresenting(presenter: CompanySiteUsersPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  onLoad(): Promise<void> {
    return Promise.resolve(undefined);
  }

  onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private updateView() {
    this.presenter?.updateView(CompanySiteUsersAssembler.fromState(this.state,this.router,this.i18nGateway));
  }

  public openAddUserDialog(){

  }

  public changePageSize(model:CompanySiteUsersModel){

  }

  public changePage(pageNo:number){

  }

  public openDeleteUserDialog(){

  }

  public closeAddCompanySiteUserDialog(){

  }

  public addCompanySiteUser(model:CompanySiteUsersModel){

  }

  public closeDeleteUserDialog(){

  }

  public deleteCompanySiteUser(){

  }

}
