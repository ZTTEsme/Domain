export default class Dialog{

  // add companySite
  public addCompanySite:string = "";
  public close:string = "";
  public submit:string = "";
  public openAddCompanySiteDialog:boolean = false;
  public showAddCompanySiteFailureMessage:boolean = false;
  public showAddCompanySiteSuccessMessage:boolean = false;
  public msgAddCompanySiteWithSuccess:string = "";
  public msgAddCompanySiteWithFailure:string = "";

  // delete companySite
  public openDeleteDialog:boolean = false;
  public deleteCompanySiteTitle:string = "";
  public deleteTipInfo:string = "";
  public msgDeleteCompanySiteWithSuccess:string = "";
  public showDeleteCompanySiteSuccessMessage:boolean = false;
  public showDeleteCompanySiteFailureMessage:boolean = false;
  public msgDeleteCompanySiteWithFailure:string = "";
  public currentDeleteCompanySiteId:number|null = null;
  //
  // modify companySite
  public modifyCompanySiteTitle:string="";
  public openModifyCompanySiteDialog:boolean=false;
  public showModifyCompanySiteSuccessMessage:boolean=false;
  public msgModifyCompanySiteWithSuccess:string="";
  public showModifyCompanySiteFailureMessage:boolean=false;
  public msgModifyCompanySiteWithFailure:string="";
}
