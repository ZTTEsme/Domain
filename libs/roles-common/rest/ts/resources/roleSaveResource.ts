import RolePermissionSaveResource from "./rolePermissionSaveResource";

export default interface RoleSaveResource {
  id: number | null;
  alias: string;
  defaultRole: boolean;
  permissions: RolePermissionSaveResource[];
}
