import Route from "cloos-vue-router/lib/core/route";
import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";

import AppConfigGateway from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGateway";
import NotPermittedError from "qnect-sdk-web/lib/common/core/ts/errors/notPermittedError";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import UserPermissionGateway from "../../../../roles-common/core/ts/gateways/userPermissionGateway";
import PermissionModel from "../../../../roles-common/core/ts/models/permissionModel";
import RoleListModel from "../../../../roles-common/core/ts/models/roleListModel";
import RolePermissionSaveModel from "../../../../roles-common/core/ts/models/rolePermissionSaveModel";
import RoleSaveModel from "../../../../roles-common/core/ts/models/roleSaveModel";
import RolesEditViewModelAssembler from "../assemblers/rolesEditViewModelAssembler";
import EditRoleGroupModel from "../models/editRoleGroupModel";
import EditRolePermissionModel from "../models/editRoleGroupPermissionModel";
import EditRoleModel from "../models/editRoleModel";
import RolesEditViewPresenter from "./rolesEditViewPresenter";
import RolesEditViewState from "./rolesEditViewState";

export default class RolesEditViewInteractor extends ViewInteractor<RolesEditViewPresenter> {
  private presenter: RolesEditViewPresenter | null = null;
  private state: RolesEditViewState;
  private readonly userPermissionGateway: UserPermissionGateway;
  private readonly i18nGateway: I18nGateway;
  private readonly appConfigGateway: AppConfigGateway;

  public constructor(
    router: Router,
    userPermissionGateway: UserPermissionGateway,
    i18nGateway: I18nGateway,
    appConfigGateway: AppConfigGateway
  ) {
    super(router);
    this.state = new RolesEditViewState();
    this.userPermissionGateway = userPermissionGateway;
    this.i18nGateway = i18nGateway;
    this.appConfigGateway = appConfigGateway;
  }

  public startPresenting(presenter: RolesEditViewPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    this.state.apps = await this.appConfigGateway.getApps();
    console.log(this.state.apps);
    try {
      this.state.userRoleIdStr = this.router.getPathParams().get("identifier");
      this.state.addedSuccessful = this.router.getQueryParams().get("save") === "success";
      const companyIdStr: string | undefined = this.router.getQueryParams().get("companyId");
      this.state.companyId = !Number.isNaN(companyIdStr) ? Number(companyIdStr) : undefined;
      if (this.state.companyId !== undefined) {
        this.state.permissions = await this.userPermissionGateway.getPermissions(this.state.companyId);
      }

      if (this.state.userRoleIdStr === "new") {
        this.state.isNewMode = true;
        this.state.userRoleId = undefined;
        this.state.role = this.toEditModel(new RoleListModel(), this.state.permissions);
      } else if (!Number.isNaN(this.state.userRoleIdStr) && this.state.companyId !== undefined) {
        this.state.userRoleId = Number(this.state.userRoleIdStr);
        this.state.isEditMode = true;
        this.state.role = this.toEditModel(
          await this.userPermissionGateway.getRole(this.state.companyId, this.state.userRoleId),
          this.state.permissions
        );
      } else {
        this.state.isInvalidMode = true;
      }
    } catch (error) {
      if (error instanceof NotPermittedError) {
        this.state.noAccess = true;
      } else {
        this.state.isInvalidMode = true;
      }
      console.log(error);
    }
  }

  public async onUnload(): Promise<void> {
    this.state = new RolesEditViewState();
  }

  public requestDeleteRole(): void {
    this.state.deleteRequested = true;
    this.updateView();
  }

  public dismissDelete(): void {
    this.state.deleteRequested = false;
    this.state.deleteFailed = false;
    this.updateView();
  }

  public async deleteRole(): Promise<void> {
    this.state.loading = true;
    this.state.deleteFailed = false;
    this.updateView();

    if (this.state.userRoleId !== undefined && this.state.companyId !== undefined) {
      try {
        await this.userPermissionGateway.deleteRole(this.state.companyId, this.state.userRoleId);
        this.state.deleteRequested = false;
        this.updateView();

        const parentRoute: Route | null = this.router.getCurrentRoute().parent;
        if (parentRoute !== null) {
          void this.router.loadRoute(parentRoute, new Map([]), new Map([["delete", "success"]]));
        }
      } catch (error) {
        this.state.deleteFailed = true;
        console.log(error);
      } finally {
        this.state.loading = false;
        this.updateView();
      }
    }
  }

  public async saveRole(role: EditRoleModel): Promise<void> {
    this.state.role = role;
    this.state.roleNameValid = !!role.alias;

    this.validateRole();

    if (this.state.validationErrors.length === 0) {
      this.state.loading = true;
      this.state.saveFailed = false;
      this.state.saveSuccessful = false;
      this.state.addedSuccessful = false;
      this.updateView();

      try {
        if (this.state.companyId !== undefined) {
          if (this.state.isNewMode) {
            const addedUserRole: RoleListModel = await this.userPermissionGateway.addRole(
              this.state.companyId,
              this.toSaveModel(this.state.role)
            );
            void this.router.loadRoute(
              this.router.getCurrentRoute(),
              new Map([["identifier", `${addedUserRole.id}`]]),
              new Map([
                ["save", "success"],
                ["companyId", `${this.state.companyId}`],
              ])
            );
          } else {
            await this.userPermissionGateway.updateRole(this.state.companyId, this.toSaveModel(this.state.role));
            this.state.saveSuccessful = true;
          }
        }
      } catch (error) {
        this.state.saveFailed = true;
        console.log(error);
      } finally {
        this.state.loading = false;
      }
    }

    this.updateView();
  }

  public updateFilter(filter: string): void {
    this.state.filter = filter;

    for (const group of this.state.role.groups) {
      for (const permission of group.permissions) {
        permission.show = this.showPermissionModel(permission, group.alias, filter);
      }
      group.show = group.permissions.some((p) => p.show);
    }

    this.updateView();
  }

  private updateView(): void {
    this.presenter?.updateView(RolesEditViewModelAssembler.fromState(this.state, this.router, this.i18nGateway));
  }

  private toEditModel(model: RoleListModel, permissions: PermissionModel[]): EditRoleModel {
    const groups: EditRoleGroupModel[] = [];
    const appGroupModels: EditRoleGroupModel[] = [];

    const serviceGroupName: string = this.i18nGateway.get("permissions.generalPermissions");
    const servicePermissionModels: EditRolePermissionModel[] = this.getServicePermissions(permissions)
      .map((p) => this.toPermissionModel(p, model.permissions, serviceGroupName))
      .sort((a, b) => a.alias.localeCompare(b.alias));
    groups.push(
      new EditRoleGroupModel({
        alias: serviceGroupName,
        show: true,
        permissions: servicePermissionModels,
      })
    );

    const groupByAppIds: Map<string, PermissionModel[]> = this.groupByAppIds(permissions);
    for (const [appId, appPermissions] of groupByAppIds.entries()) {
      const groupName: string = this.getTranslationOfApp(appId);
      const appPermissionModels = appPermissions
        .map((p) => this.toPermissionModel(p, model.permissions, groupName))
        .sort((a, b) => a.alias.localeCompare(b.alias));
      appGroupModels.push(
        new EditRoleGroupModel({
          alias: groupName,
          show: true,
          permissions: appPermissionModels,
        })
      );
    }

    appGroupModels.sort((a, b) => a.alias.localeCompare(b.alias));
    appGroupModels.forEach((group) => groups.push(group));

    return new EditRoleModel({
      id: model.id,
      alias: model.alias,
      defaultRole: model.defaultRole,
      groups: groups,
    });
  }

  private getTranslationOfApp(appId: string): string {
    console.log(this.state.apps, appId);
    for (const app of this.state.apps) {
      if (app.appId === appId) {
        return this.selectTranslation(app.names, appId);
      }
    }
    return appId;
  }

  private toPermissionModel(
    permission: PermissionModel,
    availablePermissions: PermissionModel[],
    groupName: string
  ): EditRolePermissionModel {
    return new EditRolePermissionModel({
      appId: permission.appId,
      serviceId: permission.serviceId,
      permissionId: permission.permissionId,
      alias: `${this.selectTranslation(permission.translations, permission.permissionId)} (${permission.permissionId})`,
      show: this.showPermission(permission, groupName, this.state.filter),
      selected: this.isPermissionSelected(permission, availablePermissions),
    });
  }

  private groupByAppIds(permissions: PermissionModel[]): Map<string, PermissionModel[]> {
    const result: Map<string, PermissionModel[]> = new Map<string, PermissionModel[]>();
    for (const permission of permissions) {
      if (permission.serviceId === undefined && permission.appId !== undefined) {
        if (!result.has(permission.appId)) {
          result.set(permission.appId, []);
        }
        result.get(permission.appId)?.push(permission);
      }
    }
    return result;
  }

  private getServicePermissions(permissions: PermissionModel[]): PermissionModel[] {
    return permissions.filter((p) => p.serviceId !== undefined);
  }

  private selectTranslation(translations: Map<string, string>, fallback: string): string {
    const language = this.i18nGateway.getLanguage();
    const fallbackLanguage = "en-US";

    if (translations.has(language)) {
      return translations.get(language) as string;
    } else if (translations.has(fallbackLanguage)) {
      return translations.get(fallbackLanguage) as string;
    } else {
      return fallback;
    }
  }

  private toSaveModel(model: EditRoleModel): RoleSaveModel {
    const permissions: RolePermissionSaveModel[] = [];
    for (const group of model.groups) {
      for (const permission of group.permissions) {
        if (permission.selected) {
          permissions.push(
            new RolePermissionSaveModel({
              permissionId: permission.permissionId,
              appId: permission.appId,
              serviceId: permission.serviceId,
            })
          );
        }
      }
    }

    return new RoleSaveModel({
      id: model.id,
      alias: model.alias,
      defaultRole: model.defaultRole,
      permissions: permissions,
    });
  }

  private isPermissionSelected(
    selectedPermission: PermissionModel | EditRolePermissionModel,
    availablePermissions: PermissionModel[]
  ): boolean {
    return (
      availablePermissions.findIndex((p) => p.permissionId === selectedPermission.permissionId) > -1 &&
      availablePermissions.findIndex((p) => p.appId === selectedPermission.appId) > -1 &&
      availablePermissions.findIndex((p) => p.appId === selectedPermission.appId) > -1
    );
  }

  private showPermissionModel(
    permissionOfInterest: EditRolePermissionModel,
    groupName: string,
    filter: string
  ): boolean {
    if (!this.state.filter) {
      return true;
    }

    for (const permission of this.state.permissions) {
      if (
        permissionOfInterest.appId === permission.appId &&
        permissionOfInterest.serviceId === permission.serviceId &&
        permissionOfInterest.permissionId === permission.permissionId
      ) {
        return this.showPermission(permission, groupName, filter);
      }
    }
    return false;
  }

  private showPermission(permission: PermissionModel, groupName: string, filter: string): boolean {
    if (!this.state.filter) {
      return true;
    }
    const filterLower: string = filter.toLowerCase();
    for (const translation of permission.translations.values()) {
      if (translation.toLowerCase().includes(filterLower) || groupName.toLowerCase().includes(filterLower)) {
        return true;
      }
    }
    return (
      (permission.permissionId !== undefined && permission.permissionId.toLowerCase().includes(filterLower)) ||
      (permission.appId !== undefined && permission.appId.toLowerCase().includes(filterLower)) ||
      (permission.serviceId !== undefined && permission.serviceId.toLowerCase().includes(filterLower))
    );
  }

  private validateRole(): void {
    this.state.validationErrors = [];

    if (!this.state.role.alias) {
      this.state.validationErrors.push({
        field: "roleAlias",
        message: "validation.roleAliasRequired",
      });
    }
  }
}
