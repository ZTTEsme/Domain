import FormErrors from "../../entities/ts/formError";
import ValidationError from "../../entities/ts/validationError";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";

export default class CommonUtils {

  // pagination
  public static getPageData(data: any[], pageNo: number, pageSize: number): PageResult {
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let slicedData = data.slice(startIndex, endIndex);
    if(slicedData.length === 0) {
       slicedData = data.slice(0,pageSize);
    }
    return {
      data: slicedData,
      total: data.length
    };
  }

  // validateForm
  public static validateForm(formData: Record<string, any>, rules: Record<string, ValidationRule[]>,validationErrors:ValidationError[],formErrors:FormErrors): FormErrors {
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
    formErrors = validationErrors.reduce((formErrors: FormErrors, error: ValidationError): FormErrors => {
      formErrors[error.field] = error.message;
      return formErrors;
    }, {});
    return formErrors;
  }

  // 校验json对象是否为空
  public static isObjectEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  public static  isNullOrUndefined(obj: any): boolean {
    return obj === null || obj === undefined;
  }

  // 客户类型 字符串转枚举
  public static getCustomerEnumValue(enumString: string): CompanyType {
    return CompanyType[enumString as keyof typeof CompanyType];
  }

  public static deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.deepCopy) as unknown as T;
    }

    const copiedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copiedObj[key] = this.deepCopy(obj[key]);
      }
    }

    return copiedObj;
  }
}


