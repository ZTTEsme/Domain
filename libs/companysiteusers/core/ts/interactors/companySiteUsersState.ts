import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import CompanySiteUser from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteUser";
import CompanySiteWithUsers from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteWithUsers";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import FormErrors from "../../../../common/entities/ts/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import ValidationError from "../../../../common/entities/ts/validationError";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import UserTableColName from "../entities/userTableColName";

export default class CompanySiteUsersState{

  public selectedCompanyId:number|null = null;
  public selectedCompanySiteId:number|null = null;

  public companySites:CompanySite[] = [];
  public companies:Company[] = [];

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
