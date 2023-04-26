export default class Dialog{
  // add user
  public addUserDialogTitle:string=""
  public close:string = "";
  public submit:string = "";
  public openAddUserDialog:boolean = false;
  public showAddUserFailureMessage:boolean = false;
  public showAddUserSuccessMessage:boolean = false;
  public msgAddUserWithSuccess:string = "";
  public msgAddUserWithFailure:string = "";

  // delete user
  public openDeleteUserDialog:boolean = false;
  public deleteUserDialogTitle:string="";
  public deleteUserTipInfo:string="";
  public msgDeleteUserWithSuccess:string="";
  public showDeleteUserSuccessMessage:boolean=false;
  public showDeleteUserFailureMessage:boolean=false;
  public msgDeleteUserWithFailure:string="";
  public currentDeleteUserId:number|null=null;

}
