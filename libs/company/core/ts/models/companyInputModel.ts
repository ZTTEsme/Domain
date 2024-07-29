import ValidationError from "qnect-sdk-web/lib/common/core/ts/entities/validationError";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";

export default class CompanyInputModel {
  public alias: string = "";
  public type: string = "";
  public agentCompanyId: number | null = null;
  public parentCompanyId: number | null = null;
  public customerId: string = "";
  public useExternalIdentityProviders: boolean = false;

  public validationErrors: ValidationError[] = [];

  public constructor(init?: Partial<CompanyInputModel>) {
    Object.assign(this, init);
  }

  public isValid(): boolean {
    this.validationErrors = [];

    if (!JsExtension.isNonEmptyString(this.alias)) {
      this.validationErrors.push(new ValidationError({ field: "alias", message: "company.add.valid.alias" }));
    }

    if (!JsExtension.isNonEmptyString(this.type)) {
      this.validationErrors.push(new ValidationError({ field: "type", message: "company.add.valid.type" }));
    }

    if (!JsExtension.isNonEmptyString(this.customerId)) {
      this.validationErrors.push(new ValidationError({ field: "customerId", message: "company.add.valid.customerId" }));
    }

    return this.validationErrors.length === 0;
  }
}
