import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import CompanySiteGateway from "qnect-sdk-web/lib/company-site/core/ts/gateways/companySiteGateway";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanySiteModelAssembler from "../assemblers/companySiteModelAssembler";
import CompanySiteModel from "../models/companySiteModel";
import CompanySitePresenter from "./companySitePresenter";
import CompanySiteState from "./companySiteState";

export default class CompanySiteInteractor extends ViewInteractor<CompanySitePresenter> {
  public rulesForAddCompanySite: Record<string, ValidationRule[]> = {
    alias: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companySite.add.valid.alias"),
      },
    ],
  };

  public rulesForModifyCompanySite: Record<string, ValidationRule[]> = {
    alias: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companySite.modify.valid.alias"),
      },
    ],
    companyId: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companySite.modify.valid.companyId"),
      },
    ],
  };

  private presenter: CompanySitePresenter | null = null;
  private readonly sitesGateway: CompanySiteGateway;
  private readonly companiesGateway: CompanyGateway;
  private readonly state: CompanySiteState = new CompanySiteState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    sitesGateway: CompanySiteGateway,
    companiesGateway: CompanyGateway
  ) {
    super(router);
    this.sitesGateway = sitesGateway;
    this.companiesGateway = companiesGateway;
  }

  public async onLoad(): Promise<void> {
    this.state.companyId = parseInt(this.router.getPathParams().get("id")!);

    if (!isNaN(this.state.companyId)) {
      await this.getCompanySites(this.state.companyId);
      this.state.selectedCompany = await this.companiesGateway.getCompany(this.state.companyId);
      this.state.firstSelectedCompany = this.state.selectedCompany;
    }
    this.state.companiesForSelect = await this.companiesGateway.getCompanies();
    return Promise.resolve(undefined);
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public startPresenting(presenter: CompanySitePresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public updateView(): void {
    this.presenter?.updateView(CompanySiteModelAssembler.fromState(this.state, this.router, this.i18nGateway));
  }

  public showSearch(model: CompanySiteModel): void {
    this.state.showSearch = !model.showSearch;
    this.updateView();
  }

  public resetSearchForm(model: CompanySiteModel): void {
    // 重置为跳转时的companyId
    if (this.state.firstSelectedCompany !== null) {
      model.searchForm.companyId = this.state.firstSelectedCompany.id;
      void this.getCompanySites(model.searchForm.companyId!);
    }
  }

  public async changeCompany(companyId: number): Promise<void> {
    this.state.selectedCompany = await this.companiesGateway.getCompany(companyId);
    this.state.companyId = this.state.selectedCompany.id;
    await this.getCompanySites(Number(this.state.companyId));
    this.updateView();
  }

  // addCompanySite dialog
  public openAddCompanySiteDialog(): void {
    this.state.openAddCompanySiteDialog = true;
    this.updateView();
  }

  public closeAddCompanySiteDialog(): void {
    this.state.addCompanySiteFormData = new CompanySite();
    this.state.validAddCompanySiteFormErrors = {};
    this.state.resetCompanySiteAddInputState();
    this.state.openAddCompanySiteDialog = false;
    this.state.showAddCompanySiteSuccessMessage = false;
    this.state.showAddCompanySiteFailureMessage = false;
    this.updateView();
  }

  // modify companySite dialog
  public openModifyDialog(alias: string, companySiteId: number, companyId: number): void {
    this.state.modifyCompanySiteFormData = {
      alias: alias,
      companyId: companyId.toString(),
      companySiteId: companySiteId.toString(),
    };
    this.state.openModifyCompanySiteDialog = true;
    this.updateView();
  }

  public closeModifyDialog(): void {
    this.state.validModifyCompanySiteFormErrors = {};
    this.state.modifyCompanySiteFormData = {
      alias: "",
      companyId: "",
      companySiteId: "",
    };
    this.state.openModifyCompanySiteDialog = false;
    this.state.showModifyCompanySiteSuccessMessage = false;
    this.state.showModifyCompanySiteFailureMessage = false;
    this.updateView();
  }

  // delete companySite dialog
  public openDeleteDialog(companySiteId: number): void {
    this.state.openDeleteDialog = true;
    this.state.showDeleteCompanySiteSuccessMessage = false;
    this.state.showDeleteCompanySiteFailureMessage = false;
    this.state.currentDeleteCompanySiteId = companySiteId;
    this.updateView();
  }

  public closeDeleteDialog(): void {
    this.state.openDeleteDialog = false;
    this.state.showDeleteCompanySiteSuccessMessage = false;
    this.state.showDeleteCompanySiteFailureMessage = false;
    this.updateView();
  }

  public changePage(pageNo: number): void {
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public changePageSize(model: CompanySiteModel): void {
    if (this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }

  public async addCompanySite(model: CompanySiteModel): Promise<void> {
    this.state.addCompanySiteFormData = model.addCompanySiteFormData;
    this.state.validAddCompanySiteFormErrors = CommonUtils.validateForm(
      model.addCompanySiteFormData,
      this.rulesForAddCompanySite,
      this.state.validAddCompanySiteErrors,
      this.state.validAddCompanySiteFormErrors
    );

    if (CommonUtils.isObjectEmpty(this.state.validAddCompanySiteFormErrors)) {
      try {
        await this.sitesGateway.saveCompanySite(
          new CompanySite({ alias: this.state.addCompanySiteFormData.alias, companyId: this.state.companyId! })
        );
        this.state.showAddCompanySiteFailureMessage = false;
        this.state.showAddCompanySiteSuccessMessage = true;
        this.state.companySite = await this.sitesGateway.getCompanySites(this.state.companyId!);
      } catch (error) {
        this.state.showAddCompanySiteFailureMessage = true;
        this.state.showAddCompanySiteSuccessMessage = false;
      } finally {
        this.state.isLoading = false;
      }
    }
    this.updateView();
  }

  public async modifyCompanySite(model: CompanySiteModel): Promise<void> {
    this.state.modifyCompanySiteFormData = model.modifyCompanySiteFormData;
    this.state.modifyCompanySiteFormData = model.modifyCompanySiteFormData;

    this.state.validModifyCompanySiteFormErrors = CommonUtils.validateForm(
      this.state.modifyCompanySiteFormData,
      this.rulesForModifyCompanySite,
      this.state.validModifyCompanySiteErrors,
      this.state.validModifyCompanySiteFormErrors
    );

    if (CommonUtils.isObjectEmpty(this.state.validModifyCompanySiteFormErrors)) {
      try {
        await this.sitesGateway.saveCompanySite(
          new CompanySite({
            id: parseInt(this.state.modifyCompanySiteFormData.companySiteId),
            alias: this.state.modifyCompanySiteFormData.alias,
            companyId: parseInt(this.state.modifyCompanySiteFormData.companyId),
          })
        );

        this.state.showModifyCompanySiteFailureMessage = false;
        this.state.showModifyCompanySiteSuccessMessage = true;
        this.state.companySite = await this.sitesGateway.getCompanySites(this.state.companyId!);
      } catch (error) {
        this.state.showModifyCompanySiteFailureMessage = true;
        this.state.showModifyCompanySiteSuccessMessage = false;
      } finally {
        this.state.isLoading = false;
      }
    }
    this.updateView();
  }

  public async deleteCompanySite(companySiteId: number): Promise<void> {
    try {
      this.updateView();
      if (companySiteId === undefined) {
        this.state.showDeleteCompanySiteFailureMessage = true;
        this.state.showDeleteCompanySiteSuccessMessage = false;
        this.updateView();
      } else {
        await this.sitesGateway.deleteCompanySite(companySiteId);
        this.state.showDeleteCompanySiteFailureMessage = false;
        this.state.showDeleteCompanySiteSuccessMessage = true;
        this.state.companySite = await this.sitesGateway.getCompanySites(this.state.companyId!);
        this.updateView();
      }
    } catch (error) {
      this.state.showDeleteCompanySiteFailureMessage = true;
      this.state.showDeleteCompanySiteSuccessMessage = false;
      this.updateView();
    }
  }

  public async getCompanySites(companyId: number): Promise<void> {
    try {
      this.state.searchCompanySiteWasFailed = false;
      this.updateView();
      this.state.companySite = await this.sitesGateway.getCompanySites(companyId);
      this.state.selectedCompany = await this.companiesGateway.getCompany(companyId);
      this.state.searchCompanySiteWasFailed = false;
      this.updateView();
    } catch (error) {
      this.state.searchCompanySiteWasFailed = true;
      this.updateView();
    }
  }

  public async getCompanies(): Promise<void> {
    await this.companiesGateway.getCompanies();
    return Promise.resolve(undefined);
  }

  public goCompanySiteUsers(companySiteId: number, companyId: number): void {
    void this.router.loadRoute(
      this.router.getRouteByName("User"),
      new Map([
        ["companySiteId", companySiteId.toString()],
        ["id", companyId.toString()],
      ])
    );
  }
}
