import FormErrors from "../../entities/ts/formError";
import ValidationError from "../../entities/ts/validationError";

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
}


