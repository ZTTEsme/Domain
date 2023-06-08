import CompanySiteModel from "../models/companySiteModel";
import CompanySiteState from "../interactors/companySiteState";
import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import CommonUtils from "../../../../common/utils/ts/commonUtils";

export default class CompanySiteModelAssembler {
  public static fromState(
    state: CompanySiteState,
    router: Router,
    i18nGateway: I18nGateway
  ):CompanySiteModel{
    const model:CompanySiteModel = new CompanySiteModel();
    this.updateCompanySiteModel(state,model,router,i18nGateway);
    return model;
  }

  private static updateCompanySiteModel(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway: I18nGateway):void{

    model.selectedCompany = state.selectedCompany;

    model.companiesForSelect = state.companiesForSelect;

    if( model.selectedCompany !== null ) {
      model.searchForm.companyId = model.selectedCompany.id;
    }

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);

    model.moduleName = router.getCurrentRoute().name

    model.showSearch = state.showSearch;

    model.labelInfo.noDataLabel = i18nGateway.get("noDataLabel");
    model.labelInfo.serverErrorInfo = i18nGateway.get("companySite.label.serverErrorInfo");
    model.labelInfo.companyId = i18nGateway.get("companySite.label.companyId");
    model.labelInfo.aliasLabel = i18nGateway.get("companySite.label.aliasLabel");
    model.labelInfo.companyNameLabel = i18nGateway.get("companySite.label.companyNameLabel");
    model.labelInfo.companySiteNameLabel = i18nGateway.get("companySite.label.companySiteNameLabel");
    model.labelInfo.companyAliasNameLabel = i18nGateway.get("companySite.label.companyAliasNameLabel");
    model.labelInfo.companySiteAliasNameLabel = i18nGateway.get("companySite.label.companySiteAliasNameLabel");

    model.tableAction.add = i18nGateway.get("companySite.action.add");
    model.tableAction.delete = i18nGateway.get("companySite.action.delete");
    model.tableAction.modify = i18nGateway.get("companySite.action.modify");

    model.companySiteTableColName.id = i18nGateway.get("companySite.tableName.id");
    model.companySiteTableColName.alias = i18nGateway.get("companySite.tableName.alias");
    model.companySiteTableColName.companyId = i18nGateway.get("companySite.tableName.companyName");
    model.companySiteTableColName.operate = i18nGateway.get("companySite.tableName.operate");

    // search
    model.searchCompanySiteWasFailed = state.searchCompanySiteWasFailed;
    model.showSearch = state.showSearch;

    this.renderModelForAddCompanySiteDialog(state,model,router,i18nGateway);

    this.renderModelForModifyCompanySiteDialog(state,model,router,i18nGateway);

    this.renderModelForDeleteCompanySiteDialog(state,model,router,i18nGateway);

    // pagination by front
    model.pageInfo = state.pageInfo;
    model.companySite = state.companySite;
    this.updateCompanySiteInfos(model);


  }

  // add dialog
  private static renderModelForAddCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway:I18nGateway):void{
    model.dialog.submit = i18nGateway.get("companySite.dialog.submit");
    model.dialog.addCompanySite = i18nGateway.get("companySite.dialog.addCompanySite");
    model.dialog.msgAddCompanySiteWithSuccess = i18nGateway.get("companySite.dialog.msgAddCompanySiteWithSuccess");
    model.dialog.msgAddCompanySiteWithFailure = i18nGateway.get("companySite.dialog.msgAddCompanySiteWithFailure");
    model.addCompanySiteFormData = state.addCompanySiteFormData;
    model.dialog.showAddCompanySiteFailureMessage = state.showAddCompanySiteFailureMessage;
    model.dialog.showAddCompanySiteSuccessMessage = state.showAddCompanySiteSuccessMessage;
    model.dialog.openAddCompanySiteDialog = state.openAddCompanySiteDialog;
    model.validAddCompanySiteFormErrors = state.validAddCompanySiteFormErrors;

  }

  // modify dialog
  private static renderModelForModifyCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway:I18nGateway):void{
    model.dialog.modifyCompanySiteTitle = i18nGateway.get("companySite.dialog.modifyCompanySiteTitle");
    model.dialog.msgModifyCompanySiteWithSuccess = i18nGateway.get("companySite.dialog.msgModifyCompanySiteWithSuccess");
    model.dialog.msgModifyCompanySiteWithFailure = i18nGateway.get("companySite.dialog.msgModifyCompanySiteWithFailure");
    model.dialog.showModifyCompanySiteFailureMessage = state.showModifyCompanySiteFailureMessage;
    model.dialog.showModifyCompanySiteSuccessMessage = state.showModifyCompanySiteSuccessMessage;
    model.modifyCompanySiteFormData = state.modifyCompanySiteFormData;
    model.dialog.openModifyCompanySiteDialog = state.openModifyCompanySiteDialog;
    model.validModifyCompanySiteFormErrors = state.validModifyCompanySiteFormErrors;
  }


  // delete dialog
  private static renderModelForDeleteCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway:I18nGateway):void{
    model.dialog.deleteCompanySiteTitle = i18nGateway.get("companySite.dialog.deleteCompanySiteTitle");
    model.dialog.deleteTipInfo = i18nGateway.get("companySite.dialog.deleteTipInfo");
    model.dialog.msgDeleteCompanySiteWithSuccess = i18nGateway.get("companySite.dialog.msgDeleteCompanySiteWithSuccess");
    model.dialog.msgDeleteCompanySiteWithFailure = i18nGateway.get("companySite.dialog.msgDeleteCompanySiteWithFailure");
    model.dialog.openDeleteDialog= state.openDeleteDialog;
    model.dialog.currentDeleteCompanySiteId = state.currentDeleteCompanySiteId;
    model.dialog.showDeleteCompanySiteSuccessMessage = state.showDeleteCompanySiteSuccessMessage;
    model.dialog.showDeleteCompanySiteFailureMessage = state.showDeleteCompanySiteFailureMessage;
  }


  private static updateCompanySiteInfos(model:CompanySiteModel):void{
    model.pageResultForCompanySite = CommonUtils.getPageData(model.companySite,model.pageInfo.pageNo,model.pageInfo.pageSize);

  }
}
