import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import ValidationUtil from "qnect-sdk-web/lib/common/core/ts/validationUtil";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyState from "../interactors/companyState";
import CompanyInputModel from "../models/companyInputModel";
import CompanyListModel from "../models/companyListModel";
import CompanyViewModel from "../models/companyViewModel";

export default class CompanyModelAssembler {
  public static fromState(state: CompanyState, router: Router, i18nGateway: I18nGateway): CompanyViewModel {
    const model: CompanyViewModel = new CompanyViewModel();

    this.addBreadcrumb(model, i18nGateway, router);
    this.addFilter(state, model, i18nGateway, router);
    this.addCreateCompanyButton(state, model, i18nGateway);
    this.addCompaniesTable(state, model, i18nGateway, router);
    this.addCompanyDialog(state, model, i18nGateway);
    this.addDeleteDialog(state, model, i18nGateway);

    return model;
  }

  private static addBreadcrumb(model: CompanyViewModel, i18nGateway: I18nGateway, router: Router) {
    model.msgTitle = i18nGateway.get("company.title");
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(
      router,
      undefined,
      new Breadcrumb({ name: i18nGateway.get("common.home"), link: "/" })
    );
  }

  private static addFilter(state: CompanyState, model: CompanyViewModel, i18nGateway: I18nGateway, router: Router) {
    model.showLoadingIndicator = state.isLoading;
    model.msgFilterTitle = i18nGateway.get("company.tableName.agentCompany");
    model.msgChooseAllFilter = i18nGateway.get("company.label.chooseAllLabel");
    model.filterAgentId = state.filterAgentId;
    model.unfilteredCompanies = this.companiesToModels(state.companies, i18nGateway, router);
    model.showFilterErrorMessage = state.companyFilteredWithFailure;
    model.msgFilterErrorMessage = i18nGateway.get("company.label.serverErrorInfo");
  }

  private static addCreateCompanyButton(state: CompanyState, model: CompanyViewModel, i18nGateway: I18nGateway) {
    model.msgCreateCompanyAction = i18nGateway.get("company.btn.add");
  }

  private static addCompaniesTable(
    state: CompanyState,
    model: CompanyViewModel,
    i18nGateway: I18nGateway,
    router: Router
  ) {
    model.msgCompanyAlias = i18nGateway.get("company.tableName.alias");
    model.msgCompanyType = i18nGateway.get("company.tableName.type");
    model.msgCompanyParent = i18nGateway.get("company.tableName.parentCompany");
    model.msgCompanyAgent = i18nGateway.get("company.tableName.agentCompany");
    model.msgCompanyCustomer = i18nGateway.get("company.tableName.customerId");
    model.msgCompanyActions = i18nGateway.get("company.tableName.operate");
    model.msgNoCompanies = i18nGateway.get("noDataLabel");
    model.filteredCompanies = this.companiesToModels(state.filteredCompanies, i18nGateway, router, state.companies);
    model.msgCompanyEditAction = i18nGateway.get("company.btn.edit");
    model.msgCompanyDetailsAction = i18nGateway.get("company.btn.details");
    model.msgCompanyDeleteAction = i18nGateway.get("company.btn.delete");
  }

  private static addCompanyDialog(state: CompanyState, model: CompanyViewModel, i18nGateway: I18nGateway) {
    model.showCompanyDialog = state.companyDialogOpen;

    if (state.companyEditId !== undefined) {
      model.msgCompanyDialog = i18nGateway.get("company.dialog.editCompanyTitle");
      model.msgSaveSuccessMessage = i18nGateway.get("company.dialog.msgEditCompanyWithSuccess");
      model.msgSaveErrorMessage = i18nGateway.get("company.dialog.msgEditCompanyWithFailure");
    } else {
      model.msgCompanyDialog = i18nGateway.get("company.dialog.addCompany");
      model.msgSaveSuccessMessage = i18nGateway.get("company.dialog.msgAddCompanyWithSuccess");
      model.msgSaveErrorMessage = i18nGateway.get("company.dialog.msgAddCompanyWithFailure");
    }

    model.showSaveSuccessMessage = state.companyCreatedWithSuccess || state.companyUpdatedWithSuccess;
    model.showSaveErrorMessage = state.companyCreatedWithFailure || state.companyUpdatedWithFailure;

    model.msgCompanyTypeCustomer = i18nGateway.get("company.label.customer");
    model.msgCompanyTypeManufacturer = i18nGateway.get("company.label.manufacturer");
    model.msgCompanyTypeTrader = i18nGateway.get("company.label.trader");
    model.msgCompanyTypeSubsidiary = i18nGateway.get("company.label.subsidiary");

    model.companyInput = new CompanyInputModel(state.companyInput);

    model.msgCompanySaveAction = i18nGateway.get("company.dialog.submit");

    model.formErrors = ValidationUtil.validationErrorsToObject(state.companyInput.validationErrors, i18nGateway);
  }

  private static addDeleteDialog(state: CompanyState, model: CompanyViewModel, i18nGateway: I18nGateway) {
    model.showDeleteDialog = state.openDeleteDialog;
    model.msgDeleteCompany = i18nGateway.get("company.dialog.deleteCompany");
    model.msgDeleteCompanyText = i18nGateway.get("company.dialog.deleteTipInfo");
    model.msgDeleteAction = i18nGateway.get("company.dialog.submit");

    model.showDeleteSuccessMessage = state.companyDeletedWithSuccess;
    model.msgDeleteSuccessMessage = i18nGateway.get("company.dialog.msgDeleteCompanyWithSuccess");
    model.showDeleteErrorMessage = state.companyDeletedWithFailure;
    model.msgDeleteErrorMessage = i18nGateway.get("company.dialog.msgDeleteCompanyWithFailure");
  }

  private static companiesToModels(
    companies: Company[],
    i18nGateway: I18nGateway,
    router: Router,
    unfilteredCompanies?: Company[]
  ): CompanyListModel[] {
    return companies.map(
      (c) =>
        new CompanyListModel({
          id: c.id,
          alias: c.alias,
          type: this.translateCompanyType(c.type, i18nGateway),
          parentCompanyId: c.parentCompanyId,
          parentCompanyName: this.getNameOfCompany(c.parentCompanyId, unfilteredCompanies || companies),
          agentCompanyId: c.agentCompanyId,
          agentCompanyName: this.getNameOfCompany(c.agentCompanyId, unfilteredCompanies || companies),
          customerId: c.customerId,
          link: c.id ? router.getFullUriOfRouteByName("users", undefined, new Map([["id", c.id.toString()]])) : "",
        })
    );
  }

  private static getNameOfCompany(id: number | null, companies: Company[], fallback: string = "-"): string {
    for (const company of companies) {
      if (company.id === id) {
        return company.alias;
      }
    }
    return fallback;
  }

  private static translateCompanyType(type: string, i18nGateway: I18nGateway): string {
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
