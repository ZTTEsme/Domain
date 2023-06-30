import Breadcrumb from "qnect-sdk-web/lib/breadcrumb/core/ts/breadcrumb";
import CompanySite from "qnect-sdk-web/lib/company-site/core/ts/entities/companySite";
import CompanySiteUser from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteUser";
import CompanySiteWithUsers from "qnect-sdk-web/lib/company-site/core/ts/entities/companySiteWithUsers";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import FormErrors from "../../../../common/entities/ts/formError";
import PageInfo from "../../../../common/entities/ts/pageInfo";
import SearchForm from "../../../../company/core/ts/entities/searchForm";
import AddUserFormData from "../entities/addUserFormData";
import Dialog from "../entities/dialog";
import LabelInfo from "../entities/labelInfo";
import UserTableColName from "../entities/userTableColName";

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

  public companies:Company[] = [];

  public companySites:CompanySite[] = [];

  public selectedCompanyId:number|null = null;
  public selectedCompanySiteId:number|null = null;

}
