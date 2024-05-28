import PermissionListResource from "./permissionListResource";

export default interface RoleResource {
  id: number | null;
  alias: string;
  permissions: PermissionListResource[];
}
