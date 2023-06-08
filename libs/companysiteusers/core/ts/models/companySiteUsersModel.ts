import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import LabelInfo from "../entities/labelInfo";
import SearchForm from "../../../../company/core/ts/entities/searchForm";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import UserTableColName from "../entities/userTableColName";
import Dialog from "../entities/dialog";
import FormErrors from "../../../../common/entities/ts/formError";
import AddUserFormData from "../entities/addUserFormData";
import CompanySiteWithUsers from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteWithUsers";
import CompanySiteUser from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteUser";

export default class CompanySiteUsersModel{

  public pageResultForUsers:PageResult = {
    data: [],
    total: 0
  };

  public pageInfo: PageInfo = new PageInfo(1,5,[5,10,20]);

  public breadcrumb: Breadcrumb[] = [];

  public showSearch:boolean = false;

  public labelInfo:LabelInfo = new LabelInfo();

  public searchForm:SearchForm = new SearchForm();

  public isLoading:boolean = false;

  public userTableColName:UserTableColName = new UserTableColName();

  public searchCompanySiteUsersWasFailed:boolean = false;

  public dialog:Dialog = new Dialog();

  public validAddUserFormErrors: FormErrors = {};

  public addUserFormData:AddUserFormData = new AddUserFormData();

  public companySiteWithUsers: CompanySiteWithUsers = new CompanySiteWithUsers();

  public companySiteUsers:CompanySiteUser[] = [];

}
