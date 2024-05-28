import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyState from "../interactors/companyState";
import CompanyListModel from "../models/companyListModel";
import CompanyViewModel from "../models/companyViewModel";

export default class CompanyModelAssembler {
  public static fromState(state: CompanyState, router: Router, i18nGateway: I18nGateway): CompanyViewModel {
    const model: CompanyViewModel = new CompanyViewModel();
    this.initPageParams(state, model, router, i18nGateway);
    return model;
  }

  public static fromStateWithOutValidationFeedBack(
    state: CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyViewModel {
    const model: CompanyViewModel = new CompanyViewModel();
    this.initPageParams(state, model, router, i18nGateway);
    return model;
  }

  private static initPageParams(
    state: CompanyState,
    model: CompanyViewModel,
    router: Router,
    i18nGateway: I18nGateway
  ): void {
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );

    model.moduleName = router.getCurrentRoute().name;

    // loading
    model.isLoading = state.isLoading;

    model.formErrors = state.formErrors;

    model.showSearch = state.showSearch;

    // label info
    model.labelInfo.title = i18nGateway.get("company.title");
    model.labelInfo.serverErrorInfo = i18nGateway.get("company.label.serverErrorInfo");
    model.labelInfo.typeLabel = i18nGateway.get("company.label.type");
    model.labelInfo.agentCompanyNameLabel = i18nGateway.get("company.label.agentCompanyName");
    model.labelInfo.parentCompanyLabel = i18nGateway.get("company.label.parentCompany");
    model.labelInfo.aliasLabel = i18nGateway.get("company.label.alias");
    model.labelInfo.customerIdLabel = i18nGateway.get("company.label.customerId");
    model.labelInfo.chooseAllLabel = i18nGateway.get("company.label.chooseAllLabel");
    model.labelInfo.serverErrorInfo = i18nGateway.get("company.label.serverErrorInfo");
    model.labelInfo.typeLabel = i18nGateway.get("company.label.type");
    model.labelInfo.agentCompanyNameLabel = i18nGateway.get("company.label.agentCompanyName");
    model.labelInfo.aliasLabel = i18nGateway.get("company.label.alias");
    model.labelInfo.customerIdLabel = i18nGateway.get("company.label.customerId");
    model.labelInfo.chooseAllLabel = i18nGateway.get("company.label.chooseAllLabel");
    model.labelInfo.customer = i18nGateway.get("company.label.customer");
    model.labelInfo.manufacturer = i18nGateway.get("company.label.manufacturer");
    model.labelInfo.trader = i18nGateway.get("company.label.trader");
    model.labelInfo.subsidiary = i18nGateway.get("company.label.subsidiary");
    model.labelInfo.noDataLabel = i18nGateway.get("noDataLabel");

    // searchForm
    model.labelInfo.agentCompanyLabel = i18nGateway.get("company.label.agentCompanyName");

    // formData(add company && modify company)
    model.formData.type = state.companyAddState.type;
    model.formData.alias = state.companyAddState.alias;
    model.formData.agentCompanyId = state.companyAddState.agentCompanyId;
    model.formData.parentCompanyId = state.companyAddState.parentCompanyId;
    model.formData.customerId = state.companyAddState.customerId;

    // tableAction
    model.tableAction.add = i18nGateway.get("company.action.add");
    model.tableAction.delete = i18nGateway.get("company.action.delete");
    model.tableAction.modify = i18nGateway.get("company.action.modify");

    // button label
    model.labelInfo.addLabel = i18nGateway.get("company.btn.add");
    model.labelInfo.deleteLabel = i18nGateway.get("company.btn.delete");
    model.labelInfo.editLabel = i18nGateway.get("company.btn.edit");
    model.labelInfo.detailsLabel = i18nGateway.get("company.btn.details");

    // add company dialog msgAddCompanyWithSuccess
    model.dialog.addCompany = i18nGateway.get("company.dialog.addCompany");
    model.dialog.close = i18nGateway.get("company.dialog.close");
    model.dialog.submit = i18nGateway.get("company.dialog.submit");
    model.dialog.msgAddCompanyWithSuccess = i18nGateway.get("company.dialog.msgAddCompanyWithSuccess");
    model.dialog.msgAddCompanyWithFailure = i18nGateway.get("company.dialog.msgAddCompanyWithFailure");
    model.dialog.msgAddCompanyWithSuccess = i18nGateway.get("company.dialog.msgAddCompanyWithSuccess");
    model.dialog.msgAddCompanyWithFailure = i18nGateway.get("company.dialog.msgAddCompanyWithFailure");
    model.dialog.showAddCompanyFailureMessage = state.dialog.showAddCompanyFailureMessage;
    model.dialog.showAddCompanySuccessMessage = state.dialog.showAddCompanySuccessMessage;
    model.dialog.openAddCompanyDialog = state.dialog.openAddCompanyDialog;

    // delete company dialog
    model.dialog.openDeleteDialog = state.dialog.openDeleteDialog;
    model.dialog.msgDeleteCompanyWithFailure = i18nGateway.get("company.dialog.msgDeleteCompanyWithFailure");
    model.dialog.msgDeleteCompanyWithSuccess = i18nGateway.get("company.dialog.msgDeleteCompanyWithSuccess");
    model.dialog.deleteCompany = i18nGateway.get("company.dialog.deleteCompany");
    model.dialog.deleteTipInfo = i18nGateway.get("company.dialog.deleteTipInfo");
    model.dialog.msgDeleteCompanyWithFailure = i18nGateway.get("company.dialog.msgDeleteCompanyWithFailure");
    model.dialog.msgDeleteCompanyWithSuccess = i18nGateway.get("company.dialog.msgDeleteCompanyWithSuccess");
    model.dialog.deleteCompany = i18nGateway.get("company.dialog.deleteCompany");
    model.dialog.deleteTipInfo = i18nGateway.get("company.dialog.deleteTipInfo");
    model.dialog.showDeleteCompanySuccessMessage = state.dialog.showDeleteCompanySuccessMessage;
    model.dialog.showDeleteCompanyFailureMessage = state.dialog.showDeleteCompanyFailureMessage;
    model.dialog.currentDeleteCompanyId = state.dialog.currentDeleteCompanyId;

    // modify company dialog
    model.dialog.openModifyCompanyDialog = state.dialog.openModifyCompanyDialog;
    model.dialog.msgModifyCompanyWithFailure = i18nGateway.get("company.dialog.msgModifyCompanyWithFailure");
    model.dialog.msgModifyCompanyWithSuccess = i18nGateway.get("company.dialog.msgModifyCompanyWithSuccess");
    model.dialog.modifyCompanyTitle = i18nGateway.get("company.dialog.modifyCompanyTitle");
    model.dialog.openModifyCompanyDialog = state.dialog.openModifyCompanyDialog;
    model.dialog.msgModifyCompanyWithFailure = i18nGateway.get("company.dialog.msgModifyCompanyWithFailure");
    model.dialog.msgModifyCompanyWithSuccess = i18nGateway.get("company.dialog.msgModifyCompanyWithSuccess");
    model.dialog.modifyCompanyTitle = i18nGateway.get("company.dialog.modifyCompanyTitle");
    model.dialog.showModifyCompanySuccessMessage = state.dialog.showModifyCompanySuccessMessage;
    model.dialog.showModifyCompanyFailureMessage = state.dialog.showModifyCompanyFailureMessage;

    // search company
    model.searchCompaniesWasSuccess = state.searchCompaniesWasSuccess;
    model.searchCompaniesWasFailed = state.searchCompaniesWasFailed;

    // CompanyTableColName
    model.companyTableColName.agentCompanyId = i18nGateway.get("company.tableName.agentCompanyId");
    model.companyTableColName.parentCompanyId = i18nGateway.get("company.tableName.parentCompanyId");
    model.companyTableColName.alias = i18nGateway.get("company.tableName.alias");
    model.companyTableColName.type = i18nGateway.get("company.tableName.type");
    model.companyTableColName.customerId = i18nGateway.get("company.tableName.customerId");
    model.companyTableColName.operate = i18nGateway.get("company.tableName.operate");

    model.companiesNotFiltered = this.toListModel(state.companies, state.companies, i18nGateway);
    model.companiesFiltered = this.toListModel(state.companiesFiltered, state.companies, i18nGateway);

    model.filterAgentId = state.filterAgentId;

    model.formErrors = state.formErrors;
  }

  // update companies
  private static toListModel(
    companies: Company[],
    allCompanies: Company[],
    i18nGateway: I18nGateway
  ): CompanyListModel[] {
    return companies.map(
      (c) =>
        new CompanyListModel({
          id: c.id,
          alias: c.alias,
          type: this.getCompanyTypeTranslated(c.type, i18nGateway),
          parentCompanyId: c.parentCompanyId,
          parentCompanyName: this.getNameOfCompany(c.parentCompanyId, allCompanies, "N/A"),
          agentCompanyId: c.agentCompanyId,
          agentCompanyName: this.getNameOfCompany(c.agentCompanyId, allCompanies, "N/A"),
          customerId: c.customerId,
        })
    );
  }

  private static getNameOfCompany(id: number | null, companies: Company[], fallback: string): string {
    for (const company of companies) {
      if (company.id === id) {
        return company.alias;
      }
    }
    return fallback;
  }

  private static getCompanyTypeTranslated(type: string, i18nGateway: I18nGateway): string {
    switch (type) {
      case CompanyType.CUSTOMER:
        return i18nGateway.get("company.label.customer");
      case CompanyType.MANUFACTURER:
        return i18nGateway.get("company.label.manufacturer");
      case CompanyType.TRADER:
        return i18nGateway.get("company.label.trader");
      case CompanyType.SUBSIDIARY:
        return i18nGateway.get("company.label.subsidiary");
      default:
        return type;
    }
  }
}
