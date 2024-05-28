export default class PageInfo {
  public pageNo: number = 1;
  public pageSize: number = 10;
  public pageItems: number[] = [];
  public currentPageSize?: number;
  public constructor(pageNo: number, pageSize: number, pageItems: number[], currentPageSize?: number) {
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.pageItems = pageItems;
    this.currentPageSize = currentPageSize;
  }
}
