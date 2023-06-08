import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanySiteUsersPresenter from "./companySiteUsersPresenter";
import CompanySiteUsersAssembler from "../assemblers/companySiteUsersAssembler";
import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import CompanySiteUsersModel from "../models/companySiteUsersModel";
import CompanySiteUsersState from "./companySiteUsersState";
import CommonUtils from "../../../../common/utils/ts/commonUtils";

export default class CompanySiteUsersInteractor extends ViewInteractor<CompanySiteUsersPresenter> {

  public rulesForAddCompanySiteUser:Record<string, ValidationRule[]> = {
    alias: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("companySiteUser.valid.alias")
      },
    ],
    email: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("companySiteUser.valid.email")
      },
    ],
    role: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("companySiteUser.valid.role")
      },
    ]
  }

  private presenter: CompanySiteUsersPresenter | null = null;
  private readonly state: CompanySiteUsersState = new CompanySiteUsersState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly gateWay: RestCompanySiteGateway,
  ) {
    super(router);
  }

  public startPresenting(presenter: CompanySiteUsersPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    this.state.companySiteWithUsers = await this.gateWay.getCompanySite(parseInt(this.router.getPathParams().get("companySiteId")!));
    this.state.companySiteUsers = this.state.companySiteWithUsers.users;
    return Promise.resolve(undefined);
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public updateView():void {
    this.presenter?.updateView(CompanySiteUsersAssembler.fromState(this.state,this.router,this.i18nGateway));
  }


  public changePageSize(model:CompanySiteUsersModel):void{
    if(this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }

  public changePage(pageNo:number):void{
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public openDeleteUserDialog(userId:string):void{
    this.state.dialog.openDeleteUserDialog = true;
    this.state.dialog.currentDeleteCompanySiteUserId = userId;
    this.updateView();
  }

  public openAddUserDialog():void{
    this.state.validAddCompanySiteUserFormErrors = {};
    this.state.dialog.showAddUserSuccessMessage = false;
    this.state.dialog.showAddUserFailureMessage = false;
    this.state.dialog.openAddUserDialog = true;
    this.updateView();
  }

  public closeAddCompanySiteUserDialog():void{
    this.state.dialog.openAddUserDialog = false;
    this.updateView();
  }

  public async addCompanySiteUser(model:CompanySiteUsersModel):Promise<void>{

    this.state.addUserFormData = model.addUserFormData;

    this.state.validAddCompanySiteUserFormErrors = CommonUtils.validateForm(model.addUserFormData,this.rulesForAddCompanySiteUser,this.state.validAddCompanySiteUserErrors,this.state.validAddCompanySiteUserFormErrors)

    if (CommonUtils.isObjectEmpty(this.state.validAddCompanySiteUserFormErrors)) {
      try {
        await this.gateWay.inviteUserToCompanySite(parseInt(this.router.getPathParams().get("companySiteId")!),model.addUserFormData.email,model.addUserFormData.role);
        this.state.dialog.showAddUserFailureMessage = false;
        this.state.dialog.showAddUserSuccessMessage = true;
        this.state.companySiteWithUsers = await this.gateWay.getCompanySite(parseInt(this.router.getPathParams().get("companySiteId")!));
        this.state.companySiteUsers = this.state.companySiteWithUsers.users;
      } catch (error) {
        this.state.dialog.showAddUserFailureMessage = true;
        this.state.dialog.showAddUserSuccessMessage = false;
      }
      finally {
        this.state.isLoading = false;
      }
    }

    this.updateView();

  }

  public closeDeleteUserDialog():void{
    this.state.dialog.openDeleteUserDialog = false;
    this.state.dialog.showDeleteUserSuccessMessage = false;
    this.state.dialog.showDeleteUserFailureMessage = false;
    this.updateView();
  }

  public async  deleteCompanySiteUser(userId:string):Promise<void>{
    try{
      this.updateView();
      if(userId === undefined) {
        this.state.dialog.showDeleteUserFailureMessage = true;
        this.state.dialog.showDeleteUserSuccessMessage = false;
        this.updateView();
      }
      else {
        await this.gateWay.removeUserFromCompanySite(parseInt(this.router.getPathParams().get("companySiteId")!),userId);
        this.state.dialog.showDeleteUserFailureMessage = false;
        this.state.dialog.showDeleteUserSuccessMessage = true;
        this.state.companySiteWithUsers = await this.gateWay.getCompanySite(parseInt(this.router.getPathParams().get("companySiteId")!));
        this.state.companySiteUsers = this.state.companySiteWithUsers.users;
        this.updateView();
      }
    }
    catch(error){
      this.state.dialog.showDeleteUserFailureMessage = true;
      this.state.dialog.showDeleteUserSuccessMessage = false;
      this.updateView();
    }
  }

  public getSelectedItems(items:Item[]):void{
    console.log( JSON.parse(JSON.stringify(items)));
  }

  public changePageForTable(pageNo:number,pageSize:number):void{
    console.log(pageNo);
    console.log(pageSize);
  }

  public sort(field:string,type:string):void{
    console.log(field);
    console.log(type);
  }


}
