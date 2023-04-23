import CompanySiteModel from "../models/companySiteModel";
import CompanySiteState from "../interactors/companySiteState";
import Router from "cloos-vue-router/lib/core/router";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import BreadcrumbUtil from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumbUtil";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import FormErrors from "../../../../company/core/ts/entities/formError";
import ValidationError from "../../../../company/core/ts/entities/validationError";
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
    this.addTestTableData(model);

    // 添加公司信息，默认选中第一条
    this.addCompanyInfos(model);
    model.searchForm.companyId = model.company[0].agentCompanyId;

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
    model.validAddCompanySiteErrors = state.validAddCompanySiteErrors;
    this.addFeedbackToAddForm(state,model,i18nGateway);

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
    model.validModifyCompanySiteErrors = state.validModifyCompanySiteErrors;
    this.addFeedbackToModifyForm(state,model,i18nGateway);
  }


  // delete dialog
  private static renderModelForDeleteCompanySiteDialog(state:CompanySiteState,model:CompanySiteModel,router: Router){
    model.dialog.deleteCompanySiteTitle = "Delete companySite";
    model.dialog.deleteTipInfo = "Sure to delete?"
    model.dialog.msgDeleteCompanySiteWithSuccess = "Success to delete companySite"
    model.dialog.msgDeleteCompanySiteWithFailure = "Failed to delete companySite"
    model.dialog.openDeleteDialog= state.openDeleteDialog;
    model.dialog.currentDeleteCompanyId = state.currentDeleteCompanyId;
    model.dialog.showDeleteCompanySiteSuccessMessage = state.showDeleteCompanySiteSuccessMessage;
    model.dialog.showDeleteCompanySiteFailureMessage = state.showDeleteCompanySiteFailureMessage;
  }

  private static addFeedbackToAddForm(
    state: CompanySiteState,
    model: CompanySiteModel,
    i18nGateway: I18nGateway
  ): void {
    model.validAddCompanySiteErrors = state.validationErrors.reduce((formErrors: FormErrors, error: ValidationError): FormErrors => {
      formErrors[error.field] = error.message;
      return formErrors;
    }, {});
  }

  private static addFeedbackToModifyForm(
    state: CompanySiteState,
    model: CompanySiteModel,
    i18nGateway: I18nGateway
  ): void {
    model.validModifyCompanySiteErrors = state.validationErrors.reduce((formErrors: FormErrors, error: ValidationError): FormErrors => {
      formErrors[error.field] = error.message;
      return formErrors;
    }, {});
  }

  private static addTestTableData(model:CompanySiteModel){
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.companySite.push(new CompanySite({alias:"test1",companyId:2}));
    model.companySite.push(new CompanySite({alias:"test2",companyId:3}));
    model.companySite.push(new CompanySite({alias:"test3",companyId:4}));
    model.pageResultForCompanySite = CommonUtils.getPageData(model.companySite,model.pageInfo.pageNo,model.pageInfo.pageSize);

  }

  private static addCompanyInfos(model:CompanySiteModel){
    model.company.push(new Company({agentCompanyId:2,alias:"埃斯顿01",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new Company({agentCompanyId:3,alias:"埃斯顿02",type:CompanyType.CUSTOMER,customerId:"test"}));
    model.company.push(new Company({agentCompanyId:4,alias:"埃斯顿03",type:CompanyType.CUSTOMER,customerId:"test"}));
  }
}
