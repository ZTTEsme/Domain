import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanyPresenter from "./companyPresenter";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Router from "cloos-vue-router/lib/core/router";
import CompanyModelAssembler from "../assemblers/companyModelAssembler";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyModel from "../models/companyModel";
import CompanyState from "./companyState";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import Utils from "./utils"
import OperateType from "../enums/operateType";

export default class CompanyInteractor extends ViewInteractor<CompanyPresenter>{
  private readonly i18nGateway: I18nGateway;
  private readonly gateWay: RestCompanyGateway;
  private presenter: CompanyPresenter | null =null;
  private readonly state: CompanyState =new CompanyState();

  public constructor(
    router: Router,
    i18nGateway: I18nGateway,
    gateWay: RestCompanyGateway,
  ) {
    super(router);
    this.i18nGateway = i18nGateway;
    this.gateWay = gateWay;
  }



  async onLoad(): Promise<void> {
    await this.getCompanies();
  }

  onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  startPresenting(presenter: CompanyPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  async getCompanies(agentId?: number | undefined):Promise<void> {
    try{
      this.state.searchCompaniesWasFailed  = false;
      this.updateView();
      if(agentId == undefined) {
        this.state.isLoading = true;
        this.updateView();
        await this.gateWay.getCompanies();
        this.state.searchCompaniesWasFailed  = false;
        this.state.agentCompanyId = agentId;
        this.state.isLoading = false;
        this.updateView();
      }
      else {
        await this.gateWay.getCompanies(agentId)
        this.state.searchCompaniesWasFailed  = false;
        this.state.agentCompanyId = agentId;
        this.state.isLoading = false;
        this.updateView();
      }
    }
    catch(error){
      this.state.searchCompaniesWasFailed  = true;
      this.state.agentCompanyId = agentId;
      this.state.isLoading = false;
      this.updateView();
    }
  }

  async deleteCompany(companyId: number): Promise<void> {
    try{
      if(companyId == undefined) {
        this.state.showDeleteCompanyFailureMessage = true;
        this.state.showDeleteCompanySuccessMessage = false;
        this.updateView();
      }
      else {
        debugger
        await this.gateWay.deleteCompany(companyId);
        this.state.showDeleteCompanyFailureMessage = false;
        this.state.showDeleteCompanySuccessMessage = true;
        this.updateView();
      }
    }
    catch(error){
      this.state.showDeleteCompanyFailureMessage = true;
      this.state.showDeleteCompanySuccessMessage = false;
      this.updateView();
    }
  }

  // getCompany(companyId: number) {
  //   try{
  //     this.gateWay.getCompany(companyId).then((ele)=>{
  //
  //     });
  //   }
  //   catch(error){
  //     console.log(error);
  //
  //   }
  // }


  showSearch(model:CompanyModel){
    this.state.showSearch = !model.showSearch;
    this.updateView();
  }

  resetSearchForm(model:CompanyModel){
    model.searchForm.agentCompanyId=-1;
  }

  public changePage(pageNo:number,model?:CompanyModel){
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public changePageSize(model:CompanyModel){
    if(this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }

  resetFormData(model:CompanyModel) {
    model.formData.alias="";
    model.formData.type="";
    model.formData.agentCompanyId = "";
    model.formData.customerId = "";
  }

  public async saveCompany(
    type: string,
    agentCompanyId: string,
    alias: string,
    customerId: string,
    operateType:string
  ): Promise<void> {
    this.state.companyAddState.type = type;
    this.state.companyAddState.agentCompanyId = agentCompanyId;
    this.state.companyAddState.alias = alias;
    this.state.companyAddState.customerId = customerId;

    if (Utils.validateInput(this.state,this.i18nGateway)) {
      try {
        // todo
        await this.gateWay.saveCompany(new Company({type:CompanyType.CUSTOMER,alias:this.state.alias,agentCompanyId:this.state.agentCompanyId,customerId:this.state.customerId}));
        // add company
        if(operateType === OperateType.ADD_COMPANY) {
          this.state.showAddCompanyFailureMessage = false;
          this.state.showAddCompanySuccessMessage = true;
        }

        // modify company
        if(operateType === OperateType.MODIFY_COMPANY){
          this.state.showModifyCompanyFailureMessage = false;
          this.state.showModifyCompanySuccessMessage = true;
        }
      } catch (error) {
        // add company
        if(operateType === OperateType.ADD_COMPANY) {
          this.state.showAddCompanyFailureMessage = true;
          this.state.showAddCompanySuccessMessage = false;
        }
        // modify company
        if(operateType === OperateType.MODIFY_COMPANY){
          this.state.showModifyCompanyFailureMessage = true;
          this.state.showModifyCompanySuccessMessage = false;
        }
      } finally {
        this.state.isLoading = false;
      }
    }
    this.updateView();
  }

  // delete company dialog
  public openDeleteDialog(companyId:string): void {
    this.state.openDeleteDialog = true;
    this.state.deleteSentWithSuccess = false;
    this.state.deleteSentWithFailure = false;
    this.state.currentDeleteCompanyId = companyId;
    this.updateView();
  }

  public closeDeleteDialog():void {
    this.state.openDeleteDialog = false;
    this.state.showDeleteCompanySuccessMessage = false;
    this.state.showDeleteCompanyFailureMessage = false;
    this.updateView();
  }

  // add company dialog
  public openAddCompanyDialog(): void {
    this.state.openAddCompanyDialog = true;
    this.updateView();
  }

  public closeAddCompanyDialog():void{
    this.state.resetCompanyAddInputState();
    this.state.formErrors = {};
    this.state.openAddCompanyDialog = false;
    this.state.showAddCompanySuccessMessage = false;
    this.state.showAddCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();
  }

  // modify company dialog
  public openModifyDialog(agent:number,alias:string,type:string,customerId:string):void{
    this.state.companyAddState.agentCompanyId = agent.toString();
    this.state.companyAddState.alias = alias;
    this.state.companyAddState.type = type;
    this.state.companyAddState.customerId = customerId;
    this.state.openModifyCompanyDialog = true;
    this.updateViewWithOutValidationFeedBack();
  }

  public closeModifyDialog():void {
    this.state.resetCompanyAddInputState();
    this.state.openModifyCompanyDialog = false;
    this.state.showModifyCompanySuccessMessage = false;
    this.state.showModifyCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();
  }

  private updateView() {
    this.presenter?.updateView(CompanyModelAssembler.fromState(this.state,this.router,this.i18nGateway));
  }

  private updateViewWithOutValidationFeedBack() {
    this.presenter?.updateView(CompanyModelAssembler.fromStateWithOutValidationFeedBack(this.state,this.router,this.i18nGateway));
  }



}
