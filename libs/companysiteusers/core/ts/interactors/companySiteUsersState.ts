import Dialog from "../entities/dialog";
import AddUserFormData from "../entities/addUserFormData";
import ValidationError from "../../../../common/entities/ts/validationError";
import FormErrors from "../../../../common/entities/ts/formError";
import CompanySiteWithUsers from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteWithUsers";
import CompanySiteUser from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteUser";
import UserTableColName from "../entities/userTableColName";
import PageInfo from "../../../../common/entities/ts/pageInfo";

export default class CompanySiteUsersState{

  public pageResultForUsers:PageResult = {
    data: [],
    total: 0
  };

  public currentDeleteCompanySiteUserId:string= "";

  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20],1);

  public userTableColName:UserTableColName = new UserTableColName();

  public companySiteUsers:CompanySiteUser[] = [];

  public isLoading:boolean=false;

  public dialog:Dialog = new Dialog();

  public companySiteWithUsers: CompanySiteWithUsers = new CompanySiteWithUsers();

  // add user
  public addUserFormData:AddUserFormData = new AddUserFormData();
  public validAddCompanySiteUserErrors: ValidationError[]=[];
  public validAddCompanySiteUserFormErrors: FormErrors={};

}
