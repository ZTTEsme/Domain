import Router from "cloos-vue-router/lib/core/router";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CompanyModel from "../models/companyModel";
import CompanyState from "../interactors/companyState";
import FormErrors from "../entities/formError";
import ValidationError from "../entities/validationError";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import SelfCompany from "../entities/SelfCompany";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanyModelAssembler {

  public static fromState(
    state:CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state,model,router)
    this.addFeedbackToForm(model,state,i18nGateway);
    return model;
  }

  public static fromStateWithOutValidationFeedBack(
    state:CompanyState,
    router: Router,
    i18nGateway: I18nGateway
  ): CompanyModel {
    const model: CompanyModel = new CompanyModel();
    this.initPageParams(state,model,router)
    return model;
  }

  private static initPageParams(state:CompanyState,model:CompanyModel,router: Router){
    model.breadcrumb = BreadcrumbUtil.getBreadcrumbFromCurrentRoute(router);

    model.moduleName = router.getCurrentRoute().name;

    // loading
    model.isLoading = state.isLoading;

    model.formErrors = state.formErrors;

    model.showSearch = state.showSearch;

    // searchForm
    model.labelInfo.agentCompanyLabel = "Alias Name";
    if(state.agentCompanyId === undefined) {
      // -1代表全部
      state.agentCompanyId=-1;
    }
    model.searchForm.agentCompanyId = state.agentCompanyId;

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
    model.dialog.showAddCompanyFailureMessage = state.showAddCompanyFailureMessage;
    model.dialog.showAddCompanySuccessMessage = state.showAddCompanySuccessMessage;
    model.dialog.openAddCompanyDialog = state.openAddCompanyDialog;

    // delete company dialog
    model.dialog.openDeleteDialog = state.openDeleteDialog;
    model.dialog.msgDeleteCompanyWithFailure="Failed to delete company";
    model.dialog.msgDeleteCompanyWithSuccess="Success to delete company";
    model.dialog.deleteCompany="Delete Company"
    model.dialog.deleteTipInfo="Sure to delete this company?"
    model.dialog.showDeleteCompanySuccessMessage = state.showDeleteCompanySuccessMessage;
    model.dialog.showDeleteCompanyFailureMessage = state.showDeleteCompanyFailureMessage;
    model.dialog.currentDeleteCompanyId = state.currentDeleteCompanyId;

    // modify company dialog
    model.dialog.openModifyCompanyDialog=state.openModifyCompanyDialog
    model.dialog.msgModifyCompanyWithFailure="Failed  to modify company";
    model.dialog.msgModifyCompanyWithSuccess="Success to modify company";
    model.dialog.modifyCompanyTitle="Modify Company"
    model.dialog.showModifyCompanySuccessMessage = state.showModifyCompanySuccessMessage;
    model.dialog.showModifyCompanyFailureMessage = state.showModifyCompanyFailureMessage;

    // search company
    model.searchCompaniesWasSuccess = state.searchCompaniesWasSuccess;
    model.searchCompaniesWasFailed = state.searchCompaniesWasFailed;

    // CompanyTableColName
    model.companyTableColName.agentCompanyId = "Agent Company Name"
    model.companyTableColName.alias = "Alias Name"
    model.companyTableColName.type = "Company Type"
    model.companyTableColName.customerId = "Customer Id"
    model.companyTableColName.operate = "Operate"

    // pagination by front
    model.pageInfo = state.pageInfo;
    this.addTestTableData(model,model.pageInfo);
  }

  private static addFeedbackToForm(
    model: CompanyModel,
    state: CompanyState,
    i18nGateway: I18nGateway
  ): void {
    model.formErrors = state.validationErrors.reduce((formErrors: FormErrors, error: ValidationError): FormErrors => {
      formErrors[error.field] = error.message;
      return formErrors;
    }, {});
  }

  private static addTestTableData(model:CompanyModel,pageInfo:PageInfo){
    model.company.push(new SelfCompany({id:2,agentCompanyId:1,alias:"埃斯顿",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new SelfCompany({id:3,agentCompanyId:2,alias:"大全能源",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new SelfCompany({id:4,agentCompanyId:3,alias:"三一重工",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new SelfCompany({id:5,agentCompanyId:4,alias:"宁德时代",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new SelfCompany({id:1,agentCompanyId:5,alias:"阳光电源",type:CompanyType.CUSTOMER,customerId:"test"}));

    let map:Map<number|null,string|undefined> = new Map();

    model.company.forEach((ele)=>{
      map.set(ele.id,ele.alias);
    });

    model.company.forEach((ele)=>{
      ele.agentCompanyName = map.get(ele.agentCompanyId);
    });

    model.pageResultForCompany = CommonUtils.getPageData(model.company,pageInfo.pageNo,pageInfo.pageSize);
  }

}
