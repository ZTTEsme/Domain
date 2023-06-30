/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanyModelAssembler from "../assemblers/companyModelAssembler";
import OperateType from "../enums/operateType";
import CompanyModel from "../models/companyModel";
import CompanyPresenter from "./companyPresenter";
import CompanyState from "./companyState";

export default class CompanyInteractor extends ViewInteractor<CompanyPresenter>{

  public rules:Record<string, ValidationRule[]> = {
    alias: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("company.add.valid.alias"),
      },
    ],
    type: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("company.add.valid.type"),
      },
    ],
    customerId: [
      {
        validator: (value: any) => value.length > 0,
        message: this.i18nGateway.get("company.add.valid.customerId"),
      },
    ],
  };

  private readonly gateWay: RestCompanyGateway;
  private presenter: CompanyPresenter | null =null;
  private readonly state: CompanyState =new CompanyState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    gateWay: RestCompanyGateway,
  ) {
    super(router);
    this.i18nGateway = i18nGateway;
    this.gateWay = gateWay;
  }

  public async onLoad(): Promise<void> {
    await this.getCompanies(undefined);
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public startPresenting(presenter: CompanyPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async getAllCompaniesForSelect():Promise<void>{
    this.state.allCompanies = await this.gateWay.getCompanies();
  }

  public async changeCompany(companyId:number):Promise<void> {
    await this.getCompanies(companyId);
  }

  public async getCompanies(agentId: number|undefined):Promise<void> {
    try{
      this.state.searchCompaniesWasFailed  = false;
      this.updateView();
      if(agentId === undefined) {
        this.state.isLoading = true;
        this.updateView();
        this.state.resCompanies = await this.gateWay.getCompanies();
        this.state.allCompanies = this.state.resCompanies;
        this.state.searchCompaniesWasFailed  = false;
        this.state.searchForm.agentCompanyId = agentId;
        this.state.searchForm.companyId = agentId;
        this.state.isLoading = false;
        this.updateView();
      }
      else {
        this.state.resCompanies = await this.gateWay.getCompanies(agentId)
        this.state.searchCompaniesWasFailed  = false;
        this.state.searchForm.agentCompanyId = agentId;
        this.state.searchForm.companyId = agentId;
        this.state.isLoading = false;
        this.updateView();
      }
    }
    catch(error){
      this.state.resCompanies = [];
      this.state.searchCompaniesWasFailed  = true;
      this.state.searchForm.agentCompanyId = agentId;
      this.state.searchForm.companyId = agentId;
      this.state.isLoading = false;
      this.updateView();
    }
  }

  public async deleteCompany(companyId: number): Promise<void> {
    try{
      if(companyId === undefined) {
        this.state.dialog.showDeleteCompanyFailureMessage = true;
        this.state.dialog.showDeleteCompanySuccessMessage = false;
        this.updateView();
      }
      else {
        await this.gateWay.deleteCompany(companyId);
        this.state.dialog.showDeleteCompanyFailureMessage = false;
        this.state.dialog.showDeleteCompanySuccessMessage = true;
        await this.getCompanies(this.state.searchForm.companyId);
        await this.getAllCompaniesForSelect();
        this.updateView();
      }
    }
    catch(error){
      this.state.dialog.showDeleteCompanyFailureMessage = true;
      this.state.dialog.showDeleteCompanySuccessMessage = false;
      this.updateView();
    }
  }

  public showSearch(model:CompanyModel):void{
    this.state.showSearch = !model.showSearch;
    this.updateView();
  }

  public async resetSearchForm(model:CompanyModel):Promise<void>{
    model.searchForm.agentCompanyId=undefined;
    model.searchForm.companyId=undefined;
    await this.getCompanies(model.searchForm.companyId);
  }

  public changePage(pageNo:number,model?:CompanyModel):void{
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public changePageSize(model:CompanyModel):void{
    if(this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }



  public async saveCompany (
    model:CompanyModel,
    operateType:string
  ): Promise<void> {

    this.state.companyAddState.type = model.formData.type;
    this.state.companyAddState.agentCompanyId = model.formData.agentCompanyId;
    this.state.companyAddState.alias = model.formData.alias;
    this.state.companyAddState.customerId = model.formData.customerId;

    this.state.formErrors = CommonUtils.validateForm(model.formData, this.rules,this.state.validationErrors,this.state.formErrors);

    if (CommonUtils.isObjectEmpty(this.state.formErrors)) {
      try {

        // add company
        if(operateType === OperateType.ADD_COMPANY) {
          await this.gateWay.saveCompany(new Company({
            type:CommonUtils.getCustomerEnumValue(this.state.companyAddState.type),
            alias:this.state.companyAddState.alias,
            agentCompanyId:this.state.companyAddState.agentCompanyId,
            customerId:this.state.companyAddState.customerId}));
          this.state.dialog.showAddCompanyFailureMessage = false;
          this.state.dialog.showAddCompanySuccessMessage = true;
        }

        // modify company
        if(operateType === OperateType.MODIFY_COMPANY){
          await this.gateWay.saveCompany(new Company({
            id:this.state.companyAddState.id,
            type:CommonUtils.getCustomerEnumValue(this.state.companyAddState.type),
            alias:this.state.companyAddState.alias,
            agentCompanyId:this.state.companyAddState.agentCompanyId,
            customerId:this.state.companyAddState.customerId}));
          this.state.dialog.showModifyCompanyFailureMessage = false;
          this.state.dialog.showModifyCompanySuccessMessage = true;
        }
      } catch (error) {
        // add company
        if(operateType === OperateType.ADD_COMPANY) {
          this.state.dialog.showAddCompanyFailureMessage = true;
          this.state.dialog.showAddCompanySuccessMessage = false;
        }
        // modify company
        if(operateType === OperateType.MODIFY_COMPANY){
          this.state.dialog.showModifyCompanyFailureMessage = true;
          this.state.dialog.showModifyCompanySuccessMessage = false;
        }
      } finally {
        this.state.isLoading = false;
      }
    }
    await this.getCompanies(this.state.searchForm.companyId);
    await this.getAllCompaniesForSelect();
    this.updateView();
  }

  // delete company dialog
  public openDeleteDialog(companyId:string): void {
    this.state.dialog.openDeleteDialog = true;
    this.state.dialog.deleteSentWithSuccess = false;
    this.state.dialog.deleteSentWithFailure = false;
    this.state.dialog.currentDeleteCompanyId = companyId;
    this.updateView();
  }

  public closeDeleteDialog():void {
    this.state.dialog.openDeleteDialog = false;
    this.state.dialog.showDeleteCompanySuccessMessage = false;
    this.state.dialog.showDeleteCompanyFailureMessage = false;
    this.updateView();
  }

  // add company dialog
  public openAddCompanyDialog(): void {
    this.state.dialog.openAddCompanyDialog = true;
    this.updateView();
  }

  public closeAddCompanyDialog():void{
    this.state.resetCompanyAddInputState();
    this.state.formErrors = {};
    this.state.dialog.openAddCompanyDialog = false;
    this.state.dialog.showAddCompanySuccessMessage = false;
    this.state.dialog.showAddCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();

  }

  // modify company dialog
  public openModifyDialog(companyId:number|null,agent:number | null,alias:string,type:string,customerId:string):void{
    this.state.companyAddState.id = companyId;
    this.state.companyAddState.agentCompanyId = agent;
    this.state.companyAddState.alias = alias;
    this.state.companyAddState.type = type;
    this.state.companyAddState.customerId = customerId;
    this.state.dialog.openModifyCompanyDialog = true;
    this.updateViewWithOutValidationFeedBack();
  }

  public closeModifyDialog():void {
    this.state.resetCompanyAddInputState();
    this.state.dialog.openModifyCompanyDialog = false;
    this.state.dialog.showModifyCompanySuccessMessage = false;
    this.state.dialog.showModifyCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();
  }

  public async goCompanySite(id:number):Promise<void>{
    await this.router.loadRoute(this.router.getRouteByName("CompanySite"), new Map([['id', id.toString()]]));
  }

  private updateView() {
    this.presenter?.updateView(CompanyModelAssembler.fromState(this.state,this.router,this.i18nGateway));
  }

  private updateViewWithOutValidationFeedBack() {
    this.presenter?.updateView(CompanyModelAssembler.fromStateWithOutValidationFeedBack(this.state,this.router,this.i18nGateway));
  }

}
