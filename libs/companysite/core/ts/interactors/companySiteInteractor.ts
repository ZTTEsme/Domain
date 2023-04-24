import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import Router from "cloos-vue-router/lib/core/router";
import CompanySitePresenter from "./companySitePresenter";
import RestCompanySiteGateway from "qnect-sdk-web/lib/company-site/rest/ts/gateways/restCompanySiteGateway";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanySiteModelAssembler from "../assemblers/companySiteModelAssembler";
import CompanySiteState from "./companySiteState";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import CompanySiteModel from "../models/companySiteModel";
import Utils from "../../../../companysite/core/ts/interactors/utils";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import ValidationError from "../../../../common/entities/ts/validationError";

export default class CompanySiteInteractor extends ViewInteractor<CompanySitePresenter> {
  private i18nGateway: I18nGateway;
  private presenter: CompanySitePresenter | null = null;
  private readonly gateWay: RestCompanySiteGateway;
  private readonly restCompanyGateway: RestCompanyGateway;
  private readonly state: CompanySiteState = new CompanySiteState();

  public constructor(
    router: Router,
    i18nGateway: I18nGateway,
    gateWay: RestCompanySiteGateway,
    restCompanyGateway:RestCompanyGateway
  ) {
    super(router);
    this.i18nGateway = i18nGateway;
    this.gateWay = gateWay;
    this.restCompanyGateway = restCompanyGateway
  }

  async onLoad(): Promise<void> {
    debugger
    await this.getCompanySites(1);
    return Promise.resolve(undefined);
  }

  onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  startPresenting(presenter: CompanySitePresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  private updateView() {
    this.presenter?.updateView(CompanySiteModelAssembler.fromState(this.state,this.router, this.i18nGateway));
  }

  showSearch(model:CompanySiteModel){
    this.state.showSearch = !model.showSearch;
    this.updateView();
  }

  resetSearchForm(model:CompanySiteModel){
    // 重置为第一个
    model.searchForm.companyId=model.company[0].agentCompanyId;
  }

  // addCompanySite dialog
  openAddCompanySiteDialog(){
    this.state.openAddCompanySiteDialog = true;
    this.updateView();
  }

  public closeAddCompanySiteDialog():void{
    this.state.addCompanySiteFormData = new CompanySite();
    this.state.validationErrors = [];
    this.state.resetCompanySiteAddInputState();
    this.state.openAddCompanySiteDialog = false;
    this.state.showAddCompanySiteSuccessMessage = false;
    this.state.showAddCompanySiteFailureMessage = false;
    this.updateView();
  }

  // modify companySite dialog
  public openModifyDialog(alias:string,companyId:number):void{
    this.state.modifyCompanySiteFormData = {
      alias:alias,
      companyId: companyId.toString()
    };
    this.state.openModifyCompanySiteDialog = true;
    this.updateView();
  }

  public closeModifyDialog():void {
    this.state.validModifyCompanySiteErrors = [];
    this.state.modifyCompanySiteFormData = {
      alias:"",
      companyId: ""
    };
    this.state.openModifyCompanySiteDialog = false;
    this.state.showModifyCompanySiteSuccessMessage = false;
    this.state.showModifyCompanySiteFailureMessage = false;
    this.updateView();
  }

  // delete companySite dialog
  public openDeleteDialog(companyId:number): void {
    this.state.openDeleteDialog = true;
    this.state.showDeleteCompanySiteSuccessMessage = false;
    this.state.showDeleteCompanySiteFailureMessage = false;
    this.state.currentDeleteCompanyId = companyId;
    this.updateView();
  }

  public closeDeleteDialog():void {
    this.state.openDeleteDialog = false;
    this.state.showDeleteCompanySiteSuccessMessage = false;
    this.state.showDeleteCompanySiteFailureMessage = false;
    this.updateView();
  }

  public changePage(pageNo:number){
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public changePageSize(model:CompanySiteModel){
    if(this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }

  public rulesForAddCompanySite = {
    alias: [
      {
        validator: (value: any) => value.length > 0,
        message: 'Alias is required',
      },
    ]
  };

  public async addCompanySite(
    model:CompanySiteModel
  ): Promise<void> {

    this.state.addCompanySiteFormData = model.addCompanySiteFormData;

    this.state.validAddCompanySiteErrors = CommonUtils.validateForm(model.addCompanySiteFormData,this.rulesForAddCompanySite)

    if (this.state.validAddCompanySiteErrors.length === 0) {
      try {
        await this.gateWay.saveCompanySite(new CompanySite({alias:this.state.addCompanySiteFormData.alias}));
        this.state.showAddCompanySiteFailureMessage = false;
        this.state.showAddCompanySiteSuccessMessage = true;

      } catch (error) {
        this.state.showAddCompanySiteFailureMessage = true;
        this.state.showAddCompanySiteSuccessMessage = false;
      } finally {
        this.state.isLoading = false;
      }
    }
    this.updateView();
  }

  public rulesForModifyCompanySite = {
    alias: [
      {
        validator: (value: any) => value.length > 0,
        message: 'Alias is required',
      },
    ],
    companyId: [
      {
        validator: (value: any) => value.length > 0,
        message: 'companyId is required',
      },
    ]
  };
  public async modifyCompanySite(
    model:CompanySiteModel
  ): Promise<void> {
    this.state.modifyCompanySiteFormData = model.modifyCompanySiteFormData;
    this.state.modifyCompanySiteFormData = model.modifyCompanySiteFormData;

    this.state.validModifyCompanySiteErrors = CommonUtils.validateForm(this.state.modifyCompanySiteFormData,this.rulesForModifyCompanySite);

    if (this.state.validModifyCompanySiteErrors.length === 0) {
      try {

        await this.gateWay.saveCompanySite(new CompanySite({alias:this.state.modifyCompanySiteFormData.alias,companyId:parseInt(this.state.modifyCompanySiteFormData.companyId)}));
        this.state.showModifyCompanySiteFailureMessage = false;
        this.state.showModifyCompanySiteSuccessMessage = true;

      } catch (error) {
        this.state.showModifyCompanySiteFailureMessage = true;
        this.state.showModifyCompanySiteSuccessMessage = false;
      } finally {
        this.state.isLoading = false;
      }
    }
    this.updateView();
  }


  async deleteCompanySite(companyId: number): Promise<void> {
    try{
      this.updateView();
      if(companyId == undefined) {
        this.state.showDeleteCompanySiteFailureMessage = true;
        this.state.showDeleteCompanySiteSuccessMessage = false;
        this.updateView();
      }
      else {
        await this.gateWay.deleteCompanySite(companyId);
        this.state.showDeleteCompanySiteFailureMessage = false;
        this.state.showDeleteCompanySiteSuccessMessage = true;
        this.updateView();
      }
    }
    catch(error){
      this.state.showDeleteCompanySiteFailureMessage = true;
      this.state.showDeleteCompanySiteSuccessMessage = false;
      this.updateView();
    }
  }

  async getCompanySites(companyId: number): Promise<void> {
    try{
      this.state.searchCompanySiteWasFailed  = false;
      this.updateView();
      await this.gateWay.getCompanySite(companyId);
      this.state.searchCompanySiteWasFailed  = false;
      this.updateView();

    }catch(error){
      this.state.searchCompanySiteWasFailed  = true;
      this.updateView();
    }
  }

  async getCompanies():Promise<void>{
    await this.restCompanyGateway.getCompanies();
    return Promise.resolve(undefined);
  }


}


