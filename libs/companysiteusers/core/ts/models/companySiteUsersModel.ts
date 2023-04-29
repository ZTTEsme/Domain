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

  public columns: Column[] = [
    { label: 'Name', field: 'name',render(value){
        return `<button type="button" class="btn btn-primary">`+value+`</button>`;
      }},
    { label: 'Age', field: 'age',render(value){
        return value;
      }},
    { label: 'Email', field: 'email',render(value){
        return value;
      }},
  ];

  public items: Item[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', age: 25, email: 'jane.doe@example.com' },
    { id: 3, name: 'Bob Smith', age: 40, email: 'bob.smith@example.com' },
    { id: 4, name: 'Alice Johnson', age: 35, email: 'alice.johnson@example.com' },
    { id: 5, name: 'Tom Brown', age: 28, email: 'tom.brown@example.com' },
    { id: 6, name: 'Sara Wilson', age: 32, email: 'sara.wilson@example.com' },
    { id: 7, name: 'Mike Davis', age: 45, email: 'mike.davis@example.com' },
    { id: 8, name: 'Lisa Jackson', age: 27, email: 'lisa.jackson@example.com' },
    { id: 9, name: 'Chris Lee', age: 38, email: 'chris.lee@example.com' },
    { id: 10, name: 'Amy Brown', age: 31, email: 'amy.brown@example.com' }
  ];

}
