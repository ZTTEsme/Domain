import { AxiosResponse } from "axios";
import { DateTime } from "luxon";
import AxiosErrorHandler from "qnect-sdk-web/lib/auth/rest/ts/axiosErrorHandler";
import AxiosRestClientProvider from "qnect-sdk-web/lib/auth/rest/ts/axiosRestClientProvider";
import PakInformation from "../../../core/ts/entities/pakInformation";
import UserPermissionGateway from "../../../core/ts/gateways/userPermissionGateway";
import PermissionModel from "../../../core/ts/models/permissionModel";
import RoleListModel from "../../../core/ts/models/roleListModel";
import RoleSaveModel from "../../../core/ts/models/roleSaveModel";
import PakIdLoginDataResource from "../resources/pakIdLoginDataResource";
import PermissionListResource from "../resources/permissionListResource";
import RoleResource from "../resources/roleResource";
import RoleSaveResource from "../resources/roleSaveResource";

export default class RestUserPermissionGateway implements UserPermissionGateway {
  private readonly clientProvider: AxiosRestClientProvider;

  public constructor(clientProvider: AxiosRestClientProvider) {
    this.clientProvider = clientProvider;
  }

  public async getUnusedPakIds(companyId: number): Promise<PakInformation[]> {
    const uri: string = `/api/corporate/companies/${companyId}/unassigned-pak-ids`;

    try {
      const response: AxiosResponse<PakIdLoginDataResource[]> = await this.clientProvider.getClient().get(uri);
      return response.data.map((p) => this.getPakDataFromResource(p));
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async assignPakId(companyId: number, userId: number, pakId: string | undefined): Promise<void> {
    const uri: string = `/api/corporate/companies/${companyId}/users/${userId}/pak-id`;

    try {
      await this.clientProvider.getClient().put(uri, { pakId: pakId === undefined ? null : pakId });
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async getRoles(companyId: number): Promise<RoleListModel[]> {
    const uri: string = `/api/corporate/companies/${companyId}/roles`;

    try {
      const response: AxiosResponse<RoleResource[]> = await this.clientProvider.getClient().get(uri);
      return response.data.map((r) => this.getRoleFromResource(r));
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async getRole(companyId: number, rolesId: number): Promise<RoleListModel> {
    const uri: string = `/api/corporate/companies/${companyId}/roles/${rolesId}`;

    try {
      const response: AxiosResponse<RoleResource> = await this.clientProvider.getClient().get(uri);
      return this.getRoleFromResource(response.data);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async deleteRole(companyId: number, roleId: number): Promise<void> {
    const uri: string = `/api/corporate/companies/${companyId}/roles/${roleId}`;

    try {
      await this.clientProvider.getClient().delete(uri);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async addRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel> {
    const uri: string = `/api/corporate/companies/${companyId}/roles`;

    try {
      const response: AxiosResponse<RoleResource> = await this.clientProvider
        .getClient()
        .post(uri, this.toSaveResource(role));
      return this.getRoleFromResource(response.data);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async updateRole(companyId: number, role: RoleSaveModel): Promise<RoleListModel> {
    const uri: string = `/api/corporate/companies/${companyId}/roles/${role.id}`;

    try {
      const response: AxiosResponse<RoleResource> = await this.clientProvider
        .getClient()
        .put(uri, this.toSaveResource(role));
      return this.getRoleFromResource(response.data);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async getPermissions(companyId: number): Promise<PermissionModel[]> {
    const uri: string = `/api/corporate/companies/${companyId}/permissions`;

    try {
      const response: AxiosResponse<PermissionListResource[]> = await this.clientProvider.getClient().get(uri);
      return response.data.map((p) => this.getPermissionFromResource(p));
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async assignRoleToUser(companyId: number, userId: number, roleId: number): Promise<void> {
    const uri: string = `/api/corporate/companies/${companyId}/users/${userId}/roles/${roleId}`;

    try {
      await this.clientProvider.getClient().put(uri);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async unassignRoleFromUser(companyId: number, userId: number, roleId: number): Promise<void> {
    const uri: string = `/api/corporate/companies/${companyId}/users/${userId}/roles/${roleId}`;

    try {
      await this.clientProvider.getClient().delete(uri);
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  public async updateIsAdminFlag(companyId: number, userId: number, isAdmin: boolean): Promise<void> {
    const uri: string = `/api/corporate/companies/${companyId}/users/${userId}/admin`;

    try {
      await this.clientProvider.getClient().put(uri, { isAdmin: isAdmin === undefined ? false : isAdmin });
    } catch (error) {
      throw AxiosErrorHandler.handle(error);
    }
  }

  private getRoleFromResource(resource: RoleResource): RoleListModel {
    return new RoleListModel({
      id: resource.id === null ? undefined : resource.id,
      alias: resource.alias,
      defaultRole: resource.defaultRole,
      permissions: resource.permissions.map((p) => this.getPermissionFromResource(p)),
    });
  }

  private getPermissionFromResource(resource: PermissionListResource): PermissionModel {
    const translations: Map<string, string> = new Map<string, string>();
    for (const [key, value] of Object.entries(resource.translations)) {
      translations.set(key, value);
    }

    return new PermissionModel({
      appId: resource.appId === null ? undefined : resource.appId,
      serviceId: resource.serviceId === null ? undefined : resource.serviceId,
      permissionId: resource.permissionId === null ? undefined : resource.permissionId,
      translations: translations,
    });
  }

  private getPakDataFromResource(resource: PakIdLoginDataResource): PakInformation {
    return new PakInformation({
      pakId: resource.pakId,
      deviceId: resource.deviceId,
      timestamp: DateTime.fromISO(resource.timestamp),
    });
  }

  private toSaveResource(model: RoleSaveModel): RoleSaveResource {
    return {
      id: model.id,
      alias: model.alias,
      defaultRole: model.defaultRole,
      permissions: model.permissions.map((p) => ({
        appId: p.appId === undefined ? null : p.appId,
        serviceId: p.serviceId === undefined ? null : p.serviceId,
        permissionId: p.permissionId === undefined ? null : p.permissionId,
      })),
    };
  }
}
