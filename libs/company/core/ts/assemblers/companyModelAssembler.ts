import Router from "cloos-vue-router/lib/core/router";
import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import SelfCompany from "../entities/selfCompany";
import CompanyState from "../interactors/companyState";
import CompanyModel from "../models/companyModel";

export default class CompanyModelAssembler {
  public static fromState(state: CompanyState, router: Router, i18nGateway: I18nGateway): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state, model, router, i18nGateway);
    return model;
  }

  public static fromStateWithOutValidationFeedBack(
    state: CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state, model, router, i18nGateway);
    return model;
  }

  private static initPageParams(
    state: CompanyState,
    model: CompanyModel,
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
    model.labelInfo.serverErrorInfo = i18nGateway.get("company.label.serverErrorInfo");
    model.labelInfo.typeLabel = i18nGateway.get("company.label.type");
    model.labelInfo.agentCompanyNameLabel = i18nGateway.get("company.label.agentCompanyName");
    model.labelInfo.aliasLabel = i18nGateway.get("company.label.alias");
    model.labelInfo.customerIdLabel = i18nGateway.get("company.label.customerId");
    model.labelInfo.chooseAllLabel = i18nGateway.get("company.label.chooseAllLabel");
    model.labelInfo.CUSTOMER = i18nGateway.get("company.label.CUSTOMER");
    model.labelInfo.MANUFACTURER = i18nGateway.get("company.label.MANUFACTURER");
    model.labelInfo.TRADER = i18nGateway.get("company.label.TRADER");
    model.labelInfo.noDataLabel = i18nGateway.get("noDataLabel");

    // searchForm
    model.labelInfo.agentCompanyLabel = i18nGateway.get("company.label.agentCompanyName");
    if (!CommonUtils.isNullOrUndefined(state.searchForm.companyId)) {
      model.searchForm = CommonUtils.deepCopy(state.searchForm);
    }

    // formData(add company && modify company)
    model.formData.type = state.companyAddState.type;
    model.formData.alias = state.companyAddState.alias;
    model.formData.agentCompanyId = state.companyAddState.agentCompanyId;
    model.formData.customerId = state.companyAddState.customerId;

    // tableAction
    model.tableAction.add = i18nGateway.get("company.action.add");
    model.tableAction.delete = i18nGateway.get("company.action.delete");
    model.tableAction.modify = i18nGateway.get("company.action.modify");

    // add company dialog msgAddCompanyWithSuccess
    model.dialog.addCompany = i18nGateway.get("company.dialog.addCompany");
    model.dialog.close = i18nGateway.get("company.dialog.close");
    model.dialog.submit = i18nGateway.get("company.dialog.submit");
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
    model.dialog.showDeleteCompanySuccessMessage = state.dialog.showDeleteCompanySuccessMessage;
    model.dialog.showDeleteCompanyFailureMessage = state.dialog.showDeleteCompanyFailureMessage;
    model.dialog.currentDeleteCompanyId = state.dialog.currentDeleteCompanyId;

    // modify company dialog
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
    model.companyTableColName.alias = i18nGateway.get("company.tableName.alias");
    model.companyTableColName.type = i18nGateway.get("company.tableName.type");
    model.companyTableColName.customerId = i18nGateway.get("company.tableName.customerId");
    model.companyTableColName.operate = i18nGateway.get("company.tableName.operate");

    // pagination by front
    model.pageInfo = state.pageInfo;
    this.updateCompanies(model, model.pageInfo, state);
    model.formErrors = state.formErrors;
  }

  // update companies
  private static updateCompanies(model: CompanyModel, pageInfo: PageInfo, state: CompanyState): void {
    model.allCompanies = state.allCompanies;
    for (const company of state.resCompanies) {
      model.company.push(
        new SelfCompany({
          id: company.id,
          alias: company.alias,
          type: company.type,
          customerId: company.customerId,
          agentCompanyId: company.agentCompanyId,
        })
      );
    }
    const map: Map<number | null, string | undefined> = new Map();
    model.allCompanies.forEach((ele) => {
      map.set(ele.id, ele.alias);
    });
    model.company.forEach((ele) => {
      let agentCompanyName: string | undefined = map.get(ele.agentCompanyId);
      if (CommonUtils.isNullOrUndefined(agentCompanyName)) {
        agentCompanyName = "N/A";
      }
      ele.agentCompanyName = agentCompanyName;
    });
    model.pageResultForCompany = CommonUtils.getPageData(model.company, pageInfo.pageNo, pageInfo.pageSize);
  }
}
