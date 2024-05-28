/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanyModelAssembler from "../assemblers/companyModelAssembler";
import FormDatas from "../entities/formDatas";
import OperateType from "../enums/operateType";
import CompanyPresenter from "./companyPresenter";
import CompanyState from "./companyState";

export default class CompanyInteractor extends ViewInteractor<CompanyPresenter> {
  public rules: Record<string, ValidationRule[]> = {
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

  private readonly gateway: CompanyGateway;
  private presenter: CompanyPresenter | null = null;
  private readonly state: CompanyState = new CompanyState();

  public constructor(router: Router, private readonly i18nGateway: I18nGateway, gateway: CompanyGateway) {
    super(router);
    this.i18nGateway = i18nGateway;
    this.gateway = gateway;
  }

  public async onLoad(): Promise<void> {
    await this.loadData();
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public startPresenting(presenter: CompanyPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async loadData(): Promise<void> {
    await this.getAllCompaniesForSelect();
    await this.getCompaniesFiltered();
  }

  public async getAllCompaniesForSelect(): Promise<void> {
    this.state.companies = await this.gateway.getCompanies();
  }

  public async setCompanyFilter(companyId: number | undefined): Promise<void> {
    this.state.filterAgentId = companyId;
    await this.getCompaniesFiltered();
    this.updateView();
  }

  public async getCompaniesFiltered(): Promise<void> {
    try {
      this.state.searchCompaniesWasFailed = false;
      this.updateView();
      if (this.state.filterAgentId === undefined) {
        this.state.isLoading = true;
        this.updateView();
        this.state.companiesFiltered = await this.gateway.getCompanies();
        this.state.searchCompaniesWasFailed = false;
        this.state.isLoading = false;
        this.updateView();
      } else {
        this.state.companiesFiltered = await this.gateway.getCompaniesByAgent(this.state.filterAgentId);
        this.state.searchCompaniesWasFailed = false;
        this.state.isLoading = false;
        this.updateView();
      }
    } catch (error) {
      this.state.companiesFiltered = [];
      this.state.searchCompaniesWasFailed = true;
      this.state.isLoading = false;
      this.updateView();
    }
  }

  public async deleteCompany(companyId: number): Promise<void> {
    try {
      if (companyId === undefined) {
        this.state.dialog.showDeleteCompanyFailureMessage = true;
        this.state.dialog.showDeleteCompanySuccessMessage = false;
        this.updateView();
      } else {
        await this.gateway.deleteCompany(companyId);
        this.state.dialog.showDeleteCompanyFailureMessage = false;
        this.state.dialog.showDeleteCompanySuccessMessage = true;
        await this.getCompaniesFiltered();
        await this.getAllCompaniesForSelect();
        this.updateView();
      }
    } catch (error) {
      this.state.dialog.showDeleteCompanyFailureMessage = true;
      this.state.dialog.showDeleteCompanySuccessMessage = false;
      this.updateView();
    }
  }

  public showSearch(): void {
    this.state.showSearch = !this.state.showSearch;
    this.updateView();
  }

  public async saveCompany(formData: FormDatas, operateType: string): Promise<void> {
    this.state.companyAddState.type = formData.type;
    this.state.companyAddState.agentCompanyId = formData.agentCompanyId;
    this.state.companyAddState.parentCompanyId = formData.parentCompanyId;
    this.state.companyAddState.alias = formData.alias;
    this.state.companyAddState.customerId = formData.customerId;

    this.state.formErrors = CommonUtils.validateForm(
      formData,
      this.rules,
      this.state.validationErrors,
      this.state.formErrors
    );

    if (CommonUtils.isObjectEmpty(this.state.formErrors)) {
      try {
        // add company
        if (operateType === OperateType.ADD_COMPANY) {
          await this.gateway.saveCompany(
            new Company({
              type: CommonUtils.getCustomerEnumValue(this.state.companyAddState.type),
              alias: this.state.companyAddState.alias,
              parentCompanyId: this.state.companyAddState.parentCompanyId,
              agentCompanyId: this.state.companyAddState.agentCompanyId,
              customerId: this.state.companyAddState.customerId,
            })
          );
          this.state.dialog.showAddCompanyFailureMessage = false;
          this.state.dialog.showAddCompanySuccessMessage = true;
        }

        // modify company
        if (operateType === OperateType.MODIFY_COMPANY) {
          await this.gateway.saveCompany(
            new Company({
              id: this.state.companyAddState.id,
              type: CommonUtils.getCustomerEnumValue(this.state.companyAddState.type),
              alias: this.state.companyAddState.alias,
              parentCompanyId: this.state.companyAddState.parentCompanyId,
              agentCompanyId: this.state.companyAddState.agentCompanyId,
              customerId: this.state.companyAddState.customerId,
            })
          );
          this.state.dialog.showModifyCompanyFailureMessage = false;
          this.state.dialog.showModifyCompanySuccessMessage = true;
        }
      } catch (error) {
        // add company
        if (operateType === OperateType.ADD_COMPANY) {
          this.state.dialog.showAddCompanyFailureMessage = true;
          this.state.dialog.showAddCompanySuccessMessage = false;
        }
        // modify company
        if (operateType === OperateType.MODIFY_COMPANY) {
          this.state.dialog.showModifyCompanyFailureMessage = true;
          this.state.dialog.showModifyCompanySuccessMessage = false;
        }
      } finally {
        this.state.isLoading = false;
      }
    }
    await this.loadData();
    this.updateView();
  }

  // delete company dialog
  public openDeleteDialog(companyId: string): void {
    this.state.dialog.openDeleteDialog = true;
    this.state.dialog.deleteSentWithSuccess = false;
    this.state.dialog.deleteSentWithFailure = false;
    this.state.dialog.currentDeleteCompanyId = companyId;
    this.updateView();
  }

  public closeDeleteDialog(): void {
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

  public closeAddCompanyDialog(): void {
    this.state.resetCompanyAddInputState();
    this.state.formErrors = {};
    this.state.dialog.openAddCompanyDialog = false;
    this.state.dialog.showAddCompanySuccessMessage = false;
    this.state.dialog.showAddCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();
  }

  // modify company dialog
  public openModifyDialog(companyId: number | null): void {
    if (companyId !== null) {
      for (const company of this.state.companies) {
        if (company.id === companyId) {
          this.state.companyAddState.id = company.id;
          this.state.companyAddState.agentCompanyId = company.parentCompanyId;
          this.state.companyAddState.agentCompanyId = company.agentCompanyId;
          this.state.companyAddState.alias = company.alias;
          this.state.companyAddState.type = company.type;
          this.state.companyAddState.customerId = company.customerId;
          this.state.dialog.openModifyCompanyDialog = true;
        }
      }
    }

    this.updateViewWithOutValidationFeedBack();
  }

  public closeModifyDialog(): void {
    this.state.resetCompanyAddInputState();
    this.state.dialog.openModifyCompanyDialog = false;
    this.state.dialog.showModifyCompanySuccessMessage = false;
    this.state.dialog.showModifyCompanyFailureMessage = false;
    this.updateViewWithOutValidationFeedBack();
  }

  public async goCompany(id: number): Promise<void> {
    await this.router.loadRoute(this.router.getRouteByName("users"), new Map([["id", id.toString()]]));
  }

  private updateView() {
    this.presenter?.updateView(CompanyModelAssembler.fromState(this.state, this.router, this.i18nGateway));
  }

  private updateViewWithOutValidationFeedBack() {
    this.presenter?.updateView(
      CompanyModelAssembler.fromStateWithOutValidationFeedBack(this.state, this.router, this.i18nGateway)
    );
  }
}
