import { DateTime, Duration } from "luxon";
import NotFoundError from "qnect-sdk-web/lib/common/core/ts/errors/notFoundError";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";
import PakInformation from "../../entities/pakInformation";
import PermissionModel from "../../models/permissionModel";
import RoleListModel from "../../models/roleListModel";
import RoleSaveModel from "../../models/roleSaveModel";
import UserPermissionGateway from "../userPermissionGateway";

export default class UserPermissionInMemoryGateway implements UserPermissionGateway {
  private roleCounter: number = 10;
  private readonly permissions: PermissionModel[] = [
    new PermissionModel({
      appId: "app-a",
      permissionId: "1",
      translations: new Map([
        ["de-DE", "Lesen"],
        ["en-US", "Read"],
      ]),
    }),
    new PermissionModel({
      appId: "app-b",
      permissionId: "2",
      translations: new Map([
        ["de-DE", "Schreiben"],
        ["en-US", "Write"],
      ]),
    }),
    new PermissionModel({
      serviceId: "service-a",
      permissionId: "3",
      translations: new Map([
        ["de-DE", "Löschen"],
        ["en-US", "Delete"],
      ]),
    }),
  ];
  private readonly roles: RoleListModel[] = [
    new RoleListModel({
      id: 1,
      alias: "Administrator",
      permissions: [this.permissions[0], this.permissions[1], this.permissions[2]],
    }),
    new RoleListModel({
      id: 2,
      alias: "Programmer",
      permissions: [this.permissions[0], this.permissions[1]],
    }),
    new RoleListModel({
      id: 3,
      alias: "Viewer",
      permissions: [this.permissions[0]],
    }),
  ];

  private readonly pakIds: PakInformation[] = [
    new PakInformation({
      pakId: "e0752ef54204761b540ce3f5fcc4b4c9",
      deviceId: 1,
      timestamp: DateTime.utc().minus(Duration.fromISO("PT120M")),
    }),
    new PakInformation({
      pakId: "3996f5b9bab28cf67f8737ae75eb17a2",
      deviceId: 1,
      timestamp: DateTime.utc().minus(Duration.fromISO("PT156M")),
    }),
    new PakInformation({
      pakId: "7e332b53cada4ed0063d0167448bee40",
      deviceId: 2,
      timestamp: DateTime.utc().minus(Duration.fromISO("PT48H")),
    }),
  ];

  public async getUnusedPakIds(companyId: number): Promise<PakInformation[]> {
    return this.pakIds;
  }

  public async assignPakId(companyId: number, userId: number, pakId: string | undefined): Promise<void> {
    throw new NotFoundError(`User with userId '${userId}' could not be found.`);
  }

  public async getRoles(companyId: number): Promise<RoleListModel[]> {
    await JsExtension.delay(300);
    return this.roles;
  }

  public async getRole(companyId: number, roleId: number): Promise<RoleListModel> {
    await JsExtension.delay(300);
    for (const role of this.roles) {
      if (role.id === roleId) {
        return role;
      }
    }

    throw new NotFoundError(`Role with id '${roleId}' could not be found.`);
  }

  public async deleteRole(companyId: number, id: number): Promise<void> {
    await JsExtension.delay(300);
    const deleteIndex: number | null = this.getRoleIndexById(id);
    if (deleteIndex !== null) {
      this.roles.splice(deleteIndex, 1);
    } else {
      throw new NotFoundError(`Role with id '${id}' could not be found.`);
    }
  }

  public async addRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel> {
    await JsExtension.delay(300);

    role.id = this.roleCounter++;
    this.roles.push(this.toRoleModel(role));

    return await this.getRole(companyId, role.id);
  }

  public async updateRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel> {
    await JsExtension.delay(300);

    const replaceIndex: number | null = this.getRoleIndexById(role.id);
    if (replaceIndex !== null) {
      this.roles.splice(replaceIndex, 1, this.toRoleModel(role));
    } else {
      throw new NotFoundError(`Role with id '${role.id}' could not be found.`);
    }

    return await this.getRole(companyId, role.id);
  }

  public async getPermissions(companyId: number): Promise<PermissionModel[]> {
    await JsExtension.delay(300);
    return this.permissions;
  }

  public async assignRoleToUser(companyId: number, userId: number, roleId: number): Promise<void> {
    await JsExtension.delay(300);
  }

  public async unassignRoleFromUser(companyId: number, userId: number, roleId: number): Promise<void> {
    await JsExtension.delay(300);
  }

  private toRoleModel(role: RoleSaveModel): RoleListModel {
    return new RoleListModel({
      id: role.id,
      alias: role.alias,
      permissions: role.permissions.map(
        (p) =>
          new PermissionModel({
            permissionId: p.permissionId,
            appId: p.appId,
            serviceId: p.serviceId,
            translations: new Map(), //TODO
          })
      ),
    });
  }

  private getRoleIndexById(id: number): number | null {
    for (let i: number = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === id) {
        return i;
      }
    }

    return null;
  }
}
