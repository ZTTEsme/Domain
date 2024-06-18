import ValidationError from "qnect-sdk-web/lib/common/core/ts/entities/validationError";
import ValidationUtil from "qnect-sdk-web/lib/common/core/ts/validationUtil";

export default class UserInputModel {
  public email: string = "";
  public isAdmin: boolean = false;

  public validationErrors: ValidationError[] = [];

  public constructor(init?: Partial<UserInputModel>) {
    Object.assign(this, init);
  }

  public isValid(): boolean {
    this.validationErrors = [];

    if (!ValidationUtil.isValidEmail(this.email)) {
      this.validationErrors.push(new ValidationError({ field: "email", message: "companyUser.valid.email" }));
    }

    return this.validationErrors.length === 0;
  }
}
