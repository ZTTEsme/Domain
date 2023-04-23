export default class CommonUtils {
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
}


