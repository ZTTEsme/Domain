import Dictionary from "qnect-sdk-web/lib/common/core/ts/interfaces/dictionary";

export default interface PermissionListResource {
  appId: string | null;
  serviceId: string | null;
  permissionId: string | null;
  translations: Dictionary<string>;
}
