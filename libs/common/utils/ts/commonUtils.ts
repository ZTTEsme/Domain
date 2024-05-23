/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import Language from "qnect-sdk-web/lib/i18n/core/ts/language";
import FormErrors from "../../entities/ts/formError";
import SelfLanguage from "../../entities/ts/selfLanguage";
import ValidationError from "../../entities/ts/validationError";

export default class CommonUtils {
  // pagination
  public static getPageData(data: any[], pageNo: number, pageSize: number): PageResult {
    const startIndex: number = (pageNo - 1) * pageSize;
    const endIndex: number = startIndex + pageSize;
    let slicedData: any[] = data.slice(startIndex, endIndex);
    if (slicedData.length === 0) {
      slicedData = data.slice(0, pageSize);
    }
    return {
      data: slicedData,
      total: data.length,
    };
  }

  // validateForm
  public static validateForm(
    formData: Record<string, any>,
    rules: Record<string, ValidationRule[]>,
    validationErrors: ValidationError[],
    formErrors: FormErrors
  ): FormErrors {
    validationErrors = [];
    for (const field in rules) {
      for (const rule of rules[field]) {
        const value = formData[field];
        if (!rule.validator(value)) {
          validationErrors.push({
            message: rule.message,
            field,
          });
        }
      }
    }
    formErrors = validationErrors.reduce((formError: FormErrors, error: ValidationError): FormErrors => {
      formErrors[error.field] = error.message;
      return formErrors;
    }, {});
    return formErrors;
  }

  public static isObjectEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  public static isNullOrUndefined(obj: any): boolean {
    return obj === null || obj === undefined;
  }

  public static getCustomerEnumValue(enumString: string): CompanyType {
    return CompanyType[enumString as keyof typeof CompanyType];
  }

  public static deepCopy<T>(obj: T): T {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.deepCopy) as unknown as T;
    }

    const copiedObj: any = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copiedObj[key] = this.deepCopy(obj[key]);
      }
    }

    return copiedObj;
  }

  public static checkDuplicate(arr: any[], prop: string): boolean {
    const values = arr.map((obj) => obj[prop]);
    return new Set(values).size !== values.length;
  }

  public static dealLanguages(languages: Language[]): SelfLanguage[] {
    const selfLanguages: SelfLanguage[] = [];
    languages.forEach((ele) => {
      if (ele.getKey().includes("-")) {
        selfLanguages.push(new SelfLanguage(ele.getKey().split("-")[0], ele.getLabel()));
      } else {
        selfLanguages.push(new SelfLanguage(ele.getKey(), ele.getLabel()));
      }
    });
    return selfLanguages;
  }
}
