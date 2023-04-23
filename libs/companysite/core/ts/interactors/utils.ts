import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";
import CompanySiteState from "./companySiteState";
import ValidationError from "../../../../company/core/ts/entities/validationError";

export default class Utils{
  public static validateAddCompanySiteInput(state:CompanySiteState,i18nGateway: I18nGateway,): boolean {
    state.validationErrors = [];

    if (JsExtension.isBlank(state.addCompanySiteFormData.alias)) {
      debugger
      state.validationErrors.push(new ValidationError({ field: "alias", message: "alias is required" }));
    }
    return state.validationErrors.length === 0;
  }

  public static validateModifyCompanySiteInput(state:CompanySiteState,i18nGateway: I18nGateway,): boolean {
    state.validationErrors = [];

    if (JsExtension.isBlank(state.modifyCompanySiteFormData.alias)) {
      state.validationErrors.push(new ValidationError({ field: "alias", message: "alias is required" }));
    }

    if (state.modifyCompanySiteFormData.companyId<=0) {
      state.validationErrors.push(new ValidationError({ field: "companySiteId", message: "companySiteId is required" }));
    }
    return state.validationErrors.length === 0;
  }

  // public static getPageData(data: any[], pageNo: number, pageSize: number):any[] {
  //   const startIndex = (pageNo - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   const slicedData = data.slice(startIndex, endIndex);
  //   return slicedData;
  // }

}
