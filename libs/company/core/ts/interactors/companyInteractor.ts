import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyModelAssembler from "../assemblers/companyModelAssembler";
import CompanyInputModel from "../models/companyInputModel";
import CompanyPresenter from "./companyPresenter";
import CompanyState from "./companyState";

export default class CompanyInteractor extends ViewInteractor<CompanyPresenter> {
  private presenter: CompanyPresenter | undefined;
  private readonly state: CompanyState = new CompanyState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateway: CompanyGateway
  ) {
    super(router);
  }

  public async onLoad(): Promise<void> {
    try {
      await this.loadUnfilteredCompanies();
      await this.loadFilteredCompanies();
    } catch (error) {
      console.warn("Could not load companies:", error);
    }
  }

  public startPresenting(presenter: CompanyPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async setCompanyFilter(companyId: number | undefined): Promise<void> {
    this.state.filterAgentId = companyId;
    this.state.companyFilteredWithSuccess = false;
    this.state.companyFilteredWithFailure = false;

    if (companyId !== undefined) {
      this.state.isLoading = true;
      this.updateView();

      try {
        await this.loadFilteredCompanies();
        this.state.companyFilteredWithSuccess = true;
      } catch (error) {
        this.state.companyFilteredWithFailure = true;
      }

      this.state.isLoading = false;
    } else {
      this.state.filteredCompanies = this.state.companies;
    }

    this.updateView();
  }

  public async deleteCompany(): Promise<void> {
    this.state.companyDeletedWithSuccess = false;
    this.state.companyDeletedWithFailure = false;

    if (this.state.toDeleteCompanyId !== undefined) {
      this.state.isLoading = true;
      this.updateView();

      try {
        await this.companyGateway.deleteCompany(parseInt(this.state.toDeleteCompanyId));
        await this.loadUnfilteredCompanies();
        await this.loadFilteredCompanies();

        this.state.companyDeletedWithSuccess = true;
      } catch (error) {
        this.state.companyDeletedWithFailure = true;
      }

      this.state.isLoading = false;
    }

    this.updateView();
  }

  public async saveCompany(companyInput: CompanyInputModel): Promise<void> {
    this.state.companyInput = new CompanyInputModel(companyInput);
    this.state.companyCreatedWithFailure = false;
    this.state.companyCreatedWithSuccess = false;
    this.state.companyUpdatedWithFailure = false;
    this.state.companyUpdatedWithSuccess = false;

    if (this.state.companyInput.isValid()) {
      this.state.isLoading = true;
      this.updateView();

      if (this.state.companyEditId !== undefined) {
        await this.updateCompany();
      } else {
        await this.createCompany();
      }

      try {
        await this.loadUnfilteredCompanies();
        await this.loadFilteredCompanies();
      } catch (error) {
        console.warn("Could not refresh companies", error);
      }

      this.state.isLoading = false;
    }

    this.updateView();
  }

  public openDeleteDialog(companyId: string): void {
    this.state.openDeleteDialog = true;
    this.state.companyDeletedWithSuccess = false;
    this.state.companyDeletedWithFailure = false;

    this.state.toDeleteCompanyId = companyId;
    this.updateView();
  }

  public closeDeleteDialog(): void {
    this.state.openDeleteDialog = false;
    this.updateView();
  }

  public openCompanyDialog(companyId: number | undefined): void {
    if (companyId) {
      for (const company of this.state.companies) {
        if (company.id === companyId) {
          this.state.companyEditId = companyId;
          this.state.companyInput = new CompanyInputModel({
            alias: company.alias,
            type: company.type,
            parentCompanyId: company.parentCompanyId,
            agentCompanyId: company.agentCompanyId,
            customerId: company.customerId,
          });
          this.state.companyDialogOpen = true;
          break;
        }
      }
    } else {
      this.state.companyEditId = undefined;
      this.state.companyInput = new CompanyInputModel();
      this.state.companyDialogOpen = true;
    }

    this.updateView();
  }

  public closeCompanyDialog(): void {
    this.state.companyDialogOpen = false;
    this.state.companyCreatedWithFailure = false;
    this.state.companyCreatedWithSuccess = false;
    this.state.companyUpdatedWithFailure = false;
    this.state.companyUpdatedWithSuccess = false;
    this.updateView();
  }

  private async createCompany(): Promise<void> {
    try {
      await this.companyGateway.saveCompany(
        new Company({
          alias: this.state.companyInput.alias,
          type: this.state.companyInput.type as CompanyType,
          parentCompanyId: this.state.companyInput.parentCompanyId,
          agentCompanyId: this.state.companyInput.agentCompanyId,
          customerId: this.state.companyInput.customerId,
        })
      );

      this.state.companyCreatedWithSuccess = true;
    } catch (error) {
      this.state.companyCreatedWithFailure = true;
    }
  }

  private async updateCompany(): Promise<void> {
    try {
      await this.companyGateway.saveCompany(
        new Company({
          id: this.state.companyEditId,
          alias: this.state.companyInput.alias,
          type: this.state.companyInput.type as CompanyType,
          parentCompanyId: this.state.companyInput.parentCompanyId,
          agentCompanyId: this.state.companyInput.agentCompanyId,
          customerId: this.state.companyInput.customerId,
        })
      );

      this.state.companyUpdatedWithSuccess = true;
    } catch (error) {
      this.state.companyUpdatedWithFailure = true;
    }
  }

  private async loadUnfilteredCompanies(): Promise<void> {
    this.state.companies = await this.companyGateway.getCompanies();
  }

  private async loadFilteredCompanies(): Promise<void> {
    this.state.filteredCompanies = this.state.companies;
  }

  private updateView() {
    this.presenter?.updateView(CompanyModelAssembler.fromState(this.state, this.router, this.i18nGateway));
  }
}
