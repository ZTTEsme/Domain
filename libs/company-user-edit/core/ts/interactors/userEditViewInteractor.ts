import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";

import NotPermittedError from "qnect-sdk-web/lib/common/core/ts/errors/notPermittedError";
import JsExtension from "qnect-sdk-web/lib/common/core/ts/jsExtension";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import Device from "qnect-sdk-web/lib/device/core/ts/entities/device";
import DevicesGateway from "qnect-sdk-web/lib/device/core/ts/gateways/devicesGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import UserGateway from "qnect-sdk-web/lib/users/core/ts/gateways/userGateway";
import PakInformation from "../../../../roles-common/core/ts/entities/pakInformation";
import UserPermissionGateway from "../../../../roles-common/core/ts/gateways/userPermissionGateway";
import UserEditViewModelAssembler from "../assemblers/userEditViewModelAssembler";
import UserEditViewPresenter from "./userEditViewPresenter";
import UserEditViewState from "./userEditViewState";

export default class UserEditViewInteractor extends ViewInteractor<UserEditViewPresenter> {
  private presenter: UserEditViewPresenter | undefined;
  private state: UserEditViewState;

  public constructor(
    router: Router,
    private readonly userGateway: UserGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly userPermissionGateway: UserPermissionGateway,
    private readonly i18nGateway: I18nGateway,
    private readonly devicesGateway: DevicesGateway
  ) {
    super(router);
    this.state = new UserEditViewState();
  }

  public startPresenting(presenter: UserEditViewPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    try {
      this.state.userIdStr = this.router.getPathParams().get("identifier");

      if (this.state.userIdStr && !Number.isNaN(this.state.userIdStr)) {
        this.state.userId = Number(this.state.userIdStr);
        this.state.user = await this.userGateway.getUser(this.state.userId);

        for (const connection of this.state.user.companyConnections) {
          if (connection.companyId !== null) {
            const company: Company = await this.companyGateway.getCompany(connection.companyId);
            this.state.companyNames.set(connection.companyId, company.alias);

            const pakLogins: PakInformation[] = await this.userPermissionGateway.getUnusedPakIds(connection.companyId);
            this.state.pakLoginsByCompany.set(connection.companyId, pakLogins);

            for (const pakLogin of pakLogins) {
              if (!this.state.deviceNames.has(pakLogin.deviceId)) {
                const device: Device = await this.devicesGateway.getDevice(pakLogin.deviceId);
                this.state.deviceNames.set(pakLogin.deviceId, device.alias ? device.alias : `Device ${device.id}`);
              }
            }

            for (const roleId of connection.roleIds) {
              if (roleId !== null && !this.state.roleNames.has(roleId)) {
                this.state.roleNames.set(
                  roleId,
                  (await this.userPermissionGateway.getRole(connection.companyId, roleId)).alias
                );
              }
            }

            this.state.rolesByCompany.set(
              connection.companyId,
              await this.userPermissionGateway.getRoles(connection.companyId)
            );
          }
        }
      } else {
        this.state.isInvalidMode = true;
      }
    } catch (error) {
      if (error instanceof NotPermittedError) {
        this.state.noAccess = true;
      } else {
        this.state.isInvalidMode = true;
      }
    }
  }

  public async onUnload(): Promise<void> {
    this.state = new UserEditViewState();
  }

  public async assignPakId(companyId: number, pakId: string | undefined): Promise<void> {
    this.state.pakIdUpdateSucceeded = false;
    this.state.pakIdUpdateFailed = false;
    this.updateView();

    if (this.state.user && this.state.user.companyConnections) {
      for (const connection of this.state.user.companyConnections) {
        try {
          if (connection.companyId === companyId) {
            this.userPermissionGateway.assignPakId(companyId, this.state.userId, pakId);
            connection.pakId = pakId;
            this.state.pakIdUpdateSucceeded = true;
            this.state.pakIdUpdateFailed = false;
            await JsExtension.delay(100);

            this.state.pakLoginsByCompany.set(connection.companyId, []);
            const pakLogins: PakInformation[] = await this.userPermissionGateway.getUnusedPakIds(connection.companyId);
            this.state.pakLoginsByCompany.set(connection.companyId, pakLogins);
          }
        } catch (error) {
          console.log(error);
          this.state.pakIdUpdateSucceeded = false;
          this.state.pakIdUpdateFailed = true;
        }
      }
    }

    this.updateView();
  }

  public async toggleRoleAssignment(companyId: number, roleId: number): Promise<void> {
    this.state.roleUpdateSucceeded = false;
    this.state.roleUpdateFailed = false;
    this.updateView();

    if (this.state.user && this.state.user.companyConnections) {
      for (const connection of this.state.user.companyConnections) {
        if (connection.companyId === companyId) {
          try {
            const assigned: boolean = connection.roleIds.indexOf(roleId) >= 0;
            if (!assigned) {
              this.userPermissionGateway.assignRoleToUser(companyId, this.state.userId, roleId);
              connection.roleIds.push(roleId);
            } else {
              this.userPermissionGateway.unassignRoleFromUser(companyId, this.state.userId, roleId);
              connection.roleIds = connection.roleIds.filter((id) => id !== roleId);
            }
            this.state.roleUpdateSucceeded = true;
          } catch (error) {
            console.log(error);
            this.state.roleUpdateSucceeded = false;
            this.state.roleUpdateFailed = true;
          }
        }
      }
    }

    this.updateView();
  }

  public async updateAdminFlag(companyId: number, admin: boolean): Promise<void> {
    this.state.adminFlagUpdateSucceeded = false;
    this.state.adminFlagUpdateFailed = false;
    this.updateView();

    if (this.state.user && this.state.user.companyConnections) {
      for (const connection of this.state.user.companyConnections) {
        if (connection.companyId === companyId) {
          try {
            await this.userPermissionGateway.updateIsAdminFlag(companyId, this.state.userId, admin);
            connection.admin = admin;
            this.state.adminFlagUpdateSucceeded = true;
            this.state.adminFlagUpdateFailed = false;
          } catch (error) {
            console.log(error);
            this.state.adminFlagUpdateSucceeded = false;
            this.state.adminFlagUpdateFailed = true;
          }
        }
      }
    }

    this.updateView();
  }

  private updateView(): void {
    this.presenter?.updateView(UserEditViewModelAssembler.fromState(this.state, this.router, this.i18nGateway));
  }
}
