import Router from "cloos-vue-router/lib/core/router";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyModel from "../models/companyModel";
import CompanyState from "../interactors/companyState";
import SelfCompany from "../entities/selfCompany";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanyModelAssembler {

  public static fromState(
    state:CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state,model,router,i18nGateway)
    return model;
  }

  public static fromStateWithOutValidationFeedBack(
    state:CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state,model,router,i18nGateway)
    return model;
  }

  private static initPageParams(state:CompanyState,model:CompanyModel,router: Router,i18nGateway:I18nGateway){
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);

    model.moduleName = router.getCurrentRoute().name;

    // loading
    model.isLoading = state.isLoading;

    model.formErrors = state.formErrors;

    model.showSearch = state.showSearch;


    // searchForm
    model.labelInfo.agentCompanyLabel = "Agent Company Alias Name";
    if(!CommonUtils.isNullOrUndefined(state.searchForm.companyId)){
      model.searchForm = CommonUtils.deepCopy(state.searchForm);
    }

    // formData(add company && modify company)
    model.formData.type = state.companyAddState.type;
    model.formData.alias = state.companyAddState.alias;
    model.formData.agentCompanyId = state.companyAddState.agentCompanyId;
    model.formData.customerId = state.companyAddState.customerId;

    // tableAction
    model.tableAction.add = "add";
    model.tableAction.delete = "delete"
    model.tableAction.modify = "modify"

    // add company dialog msgAddCompanyWithSuccess
    model.dialog.addCompany = "Add Company"
    model.dialog.close = "close"
    model.dialog.submit = "submit"
    model.dialog.msgAddCompanyWithSuccess="Success to add company";
    model.dialog.msgAddCompanyWithFailure="Failed to add company";
    model.dialog.showAddCompanyFailureMessage = state.dialog.showAddCompanyFailureMessage;
    model.dialog.showAddCompanySuccessMessage = state.dialog.showAddCompanySuccessMessage;
    model.dialog.openAddCompanyDialog = state.dialog.openAddCompanyDialog;

    // delete company dialog
    model.dialog.openDeleteDialog = state.dialog.openDeleteDialog;
    model.dialog.msgDeleteCompanyWithFailure="Failed to delete company";
    model.dialog.msgDeleteCompanyWithSuccess="Success to delete company";
    model.dialog.deleteCompany="Delete Company"
    model.dialog.deleteTipInfo="Sure to delete this company?"
    model.dialog.showDeleteCompanySuccessMessage = state.dialog.showDeleteCompanySuccessMessage;
    model.dialog.showDeleteCompanyFailureMessage = state.dialog.showDeleteCompanyFailureMessage;
    model.dialog.currentDeleteCompanyId = state.dialog.currentDeleteCompanyId;

    // modify company dialog
    model.dialog.openModifyCompanyDialog=state.dialog.openModifyCompanyDialog
    model.dialog.msgModifyCompanyWithFailure="Failed  to modify company";
    model.dialog.msgModifyCompanyWithSuccess="Success to modify company";
    model.dialog.modifyCompanyTitle="Modify Company"
    model.dialog.showModifyCompanySuccessMessage = state.dialog.showModifyCompanySuccessMessage;
    model.dialog.showModifyCompanyFailureMessage = state.dialog.showModifyCompanyFailureMessage;

    // search company
    model.searchCompaniesWasSuccess = state.searchCompaniesWasSuccess;
    model.searchCompaniesWasFailed = state.searchCompaniesWasFailed;

    // CompanyTableColName
    model.companyTableColName.agentCompanyId = "Agent Company Alias Name"
    model.companyTableColName.alias = "Company Alias Name"
    model.companyTableColName.type = "Company Type"
    model.companyTableColName.customerId = "Customer Id"
    model.companyTableColName.operate = "Operate"

    // pagination by front
    model.pageInfo = state.pageInfo;
    this.updateCompanies(model,model.pageInfo,state);

    // 同步异常
    model.formErrors = state.formErrors;
  }

  private static updateCompanies(model:CompanyModel,pageInfo:PageInfo,state:CompanyState){

    // allCompanies 表示 全量公司， resCompanies 表示 跟具体搜索条件关联的公司
    model.allCompanies = state.allCompanies;

    for (const company of state.resCompanies){
      model.company.push(new SelfCompany({id:company.id,alias:company.alias,type:company.type,customerId:company.customerId,agentCompanyId:company.agentCompanyId}));
    }

    let map:Map<number|null,string|undefined> = new Map();

    model.allCompanies.forEach((ele)=>{
      map.set(ele.id,ele.alias);
    });

    model.company.forEach((ele)=>{
      let agentCompanyName = map.get(ele.agentCompanyId);
      if(CommonUtils.isNullOrUndefined(agentCompanyName)){
        agentCompanyName = "N/A";
      }
      ele.agentCompanyName = agentCompanyName;
    });

    model.pageResultForCompany = CommonUtils.getPageData(model.company,pageInfo.pageNo,pageInfo.pageSize);
  }

}
