import CompanyState from "./companyState";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";
import ValidationError from "../entities/validationError";

export default class Utils{
  public static validateInput(state:CompanyState,i18nGateway: I18nGateway,): boolean {
    state.validationErrors = [];

    if (JsExtension.isBlank(state.companyAddState.type)) {
      state.validationErrors.push(new ValidationError({ field: "type", message: "type is required" }));
    }

    if (JsExtension.isBlank(state.companyAddState.agentCompanyId.toString())) {
      state.validationErrors.push(new ValidationError({ field: "agentCompanyId", message: "agentCompanyId is required" }));
    }

    if (JsExtension.isBlank(state.companyAddState.alias)) {
      state.validationErrors.push(
        new ValidationError({ field: "alias", message: "alias is required" })
      );
    }

    if (JsExtension.isBlank(state.companyAddState.customerId)) {
      state.validationErrors.push(new ValidationError({ field: "customerId", message: "customerId is required" }));
    }
    return state.validationErrors.length === 0;
  }
}
