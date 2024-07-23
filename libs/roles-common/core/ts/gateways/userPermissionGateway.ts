import PakInformation from "../entities/pakInformation";
import PermissionModel from "../models/permissionModel";
import RoleListModel from "../models/roleListModel";
import RoleSaveModel from "../models/roleSaveModel";

export default interface UserPermissionGateway {
  getUnusedPakIds(companyId: number): Promise<PakInformation[]>;
  assignPakId(companyId: number, userId: number, pakId: string | undefined): Promise<void>;
  getRoles(companyId: number): Promise<RoleListModel[]>;
  getRole(companyId: number, roleId: number): Promise<RoleListModel>;
  deleteRole(companyId: number, id: number): Promise<void>;
  addRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel>;
  updateRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel>;
  getPermissions(companyId: number): Promise<PermissionModel[]>;
  assignRoleToUser(companyId: number, userId: number, roleId: number): Promise<void>;
  unassignRoleFromUser(companyId: number, userId: number, roleId: number): Promise<void>;
  updateIsAdminFlag(companyId: number, userId: number, isAdmin: boolean): Promise<void>;
}
