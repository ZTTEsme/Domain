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

  private static updateCompanySiteModel(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway: I18nGateway){

    model.company = state.company;

    if( model.company !== null ) {
      model.searchForm.companyId = model.company.id;
      model.companiesForSelect.push(model.company);
    }

    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);

    model.moduleName = router.getCurrentRoute().name

    model.showSearch = state.showSearch;

    model.labelInfo.companyId = "Company Alias Name";

    model.tableAction.add = "add";
    model.tableAction.delete = "delete"
    model.tableAction.modify = "modify"

    model.companySiteTableColName.id = "ID"
    model.companySiteTableColName.alias = "Company Site Alias Name"
    model.companySiteTableColName.companyId = "Company Alias Name"
    model.companySiteTableColName.operate = "Operate"

    // search
    model.searchCompanySiteWasFailed = state.searchCompanySiteWasFailed;
    model.showSearch = state.showSearch;

    this.renderModelForAddCompanySiteDialog(state,model,router,i18nGateway);

    this.renderModelForModifyCompanySiteDialog(state,model,router,i18nGateway);

    this.renderModelForDeleteCompanySiteDialog(state,model,router);

    // pagination by front
    model.pageInfo = state.pageInfo;
    model.companySite = state.companySite;
    this.updateCompanySiteInfos(model);


  }

  private static initSelect(state:CompanySiteState,model:CompanySiteModel,router: Router){
    // if(state.agentCompanyId === undefined) {
    //   // -1代表全部
    //   state.agentCompanyId=-1;
    // }
    // model.searchForm.agentCompanyId = state.agentCompanyId;
  }

  // add dialog
  private static renderModelForAddCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway:I18nGateway){
    model.dialog.submit = "submit";
    model.dialog.addCompanySite = "Add Company Site";
    model.dialog.msgAddCompanySiteWithSuccess = "Success to add companySite";
    model.dialog.msgAddCompanySiteWithFailure = "Failed to add companySite";
    model.addCompanySiteFormData = state.addCompanySiteFormData;
    model.dialog.showAddCompanySiteFailureMessage = state.showAddCompanySiteFailureMessage;
    model.dialog.showAddCompanySiteSuccessMessage = state.showAddCompanySiteSuccessMessage;
    model.dialog.openAddCompanySiteDialog = state.openAddCompanySiteDialog;
    model.validAddCompanySiteFormErrors = state.validAddCompanySiteFormErrors;

  }

  // modify dialog
  private static renderModelForModifyCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router,i18nGateway:I18nGateway){
    model.dialog.modifyCompanySiteTitle = "Modify CompanySite";
    model.dialog.msgModifyCompanySiteWithSuccess = "Success Modify CompanySite";
    model.dialog.msgModifyCompanySiteWithFailure = "Failed Modify CompanySite";
    model.dialog.showModifyCompanySiteFailureMessage = state.showModifyCompanySiteFailureMessage;
    model.dialog.showModifyCompanySiteSuccessMessage = state.showModifyCompanySiteSuccessMessage;
    model.modifyCompanySiteFormData = state.modifyCompanySiteFormData;
    model.dialog.openModifyCompanySiteDialog = state.openModifyCompanySiteDialog;
    model.validModifyCompanySiteFormErrors = state.validModifyCompanySiteFormErrors;
  }


  // delete dialog
  private static renderModelForDeleteCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router){
    model.dialog.deleteCompanySiteTitle = "Delete companySite";
    model.dialog.deleteTipInfo = "Sure to delete?"
    model.dialog.msgDeleteCompanySiteWithSuccess = "Success to delete companySite"
    model.dialog.msgDeleteCompanySiteWithFailure = "Failed to delete companySite"
    model.dialog.openDeleteDialog= state.openDeleteDialog;
    model.dialog.currentDeleteCompanySiteId = state.currentDeleteCompanySiteId;
    model.dialog.showDeleteCompanySiteSuccessMessage = state.showDeleteCompanySiteSuccessMessage;
    model.dialog.showDeleteCompanySiteFailureMessage = state.showDeleteCompanySiteFailureMessage;
  }


  private static updateCompanySiteInfos(model:CompanySiteModel){
    model.pageResultForCompanySite = CommonUtils.getPageData(model.companySite,model.pageInfo.pageNo,model.pageInfo.pageSize);

  }
}
