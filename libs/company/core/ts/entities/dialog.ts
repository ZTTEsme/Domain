export default class Dialog{
  // add company
  public addCompany:string = "";
  public close:string = "";
  public submit:string = "";
  public openAddCompanyDialog:boolean = false;
  public showAddCompanyFailureMessage:boolean = false;
  public showAddCompanySuccessMessage:boolean = false;
  public msgAddCompanyWithSuccess:string = "";
  public msgAddCompanyWithFailure:string = "";

  // delete company
  public openDeleteDialog:boolean = false;
  public deleteCompany:string = "";
  public deleteTipInfo:string = "";
  public msgDeleteCompanyWithSuccess:string = "";
  public showDeleteCompanyFailureMessage:boolean = false;
  public showDeleteCompanySuccessMessage:boolean = false;
  public deleteSentWithSuccess:boolean = false;
  public deleteSentWithFailure:boolean = false;
  public msgDeleteCompanyWithFailure:string = "";
  public currentDeleteCompanyId:string = "";

  // modify company
  public modifyCompanyTitle:string = "";
  public openModifyCompanyDialog:boolean = false;
  public showModifyCompanySuccessMessage:boolean = false;
  public msgModifyCompanyWithSuccess:string = "";
  public showModifyCompanyFailureMessage:boolean = false;
  public msgModifyCompanyWithFailure:string = "";



}
