import UserModel from "qnect-sdk-web/lib/users/core/ts/models/userModel";
import PakInformation from "../../../../roles-common/core/ts/entities/pakInformation";
import RoleListModel from "../../../../roles-common/core/ts/models/roleListModel";

export default class UserEditViewState {
  public noAccess: boolean = false;
  public loading: boolean = false;

  public isEditMode: boolean = false;
  public isInvalidMode: boolean = false;
  public pakIdUpdateSucceeded: boolean = false;
  public pakIdUpdateFailed: boolean = false;
  public roleUpdateSucceeded: boolean = false;
  public roleUpdateFailed: boolean = false;

  public userIdStr: string | undefined = undefined;
  public userId: number = 0;

  public user: UserModel | undefined = undefined;
  public companyNames: Map<number, string> = new Map<number, string>();
  public roleNames: Map<number, string> = new Map<number, string>();
  public rolesByCompany: Map<number, RoleListModel[]> = new Map<number, RoleListModel[]>();
  public pakLoginsByCompany: Map<number, PakInformation[]> = new Map<number, PakInformation[]>();
  public deviceNames: Map<number, string> = new Map<number, string>();
}
