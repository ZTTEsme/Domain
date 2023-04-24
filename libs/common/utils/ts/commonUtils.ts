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
  public static validateForm(formData: Record<string, any>, rules: Record<string, ValidationRule[]>): ValidationResult[] {
    const errors: ValidationResult[] = [];

    debugger
    for (const field in rules) {
      for (const rule of rules[field]) {
        const value = formData[field];
        if (!rule.validator(value)) {
          errors.push({
            message: rule.message,
            field,
          });
        }
      }
    }

    return errors;
  }
}


