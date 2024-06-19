import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import DevicesGateway from "qnect-sdk-web/lib/device/core/ts/gateways/devicesGateway";
import DevicesGatewayMock from "qnect-sdk-web/lib/device/core/ts/gateways/devicesGatewayMock";
import RestDevicesGateway from "qnect-sdk-web/lib/device/rest/ts/gateways/restDevicesGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import UserGateway from "qnect-sdk-web/lib/users/core/ts/gateways/userGateway";
import UserGatewayMock from "qnect-sdk-web/lib/users/core/ts/gateways/userGatewayMock";
import RestUserGateway from "qnect-sdk-web/lib/users/rest/ts/gateways/restUserGateway";
import UserEditViewInteractor from "../../../libs/company-user-edit/core/ts/interactors/userEditViewInteractor";
import UserEditViewComponent from "../../../libs/company-user-edit/vue/ts/userEditViewComponent";
import CompanyUsersInteractor from "../../../libs/company-users/core/ts/interactors/companyUsersInteractor";
import CompanyUsersComponent from "../../../libs/company-users/vue/ts/companyUsersComponent";
import UserPermissionInMemoryGateway from "../../../libs/roles-common/core/ts/gateways/inmemory/userPermissionInMemoryGateway";
import UserPermissionGateway from "../../../libs/roles-common/core/ts/gateways/userPermissionGateway";
import RestUserPermissionGateway from "../../../libs/roles-common/rest/ts/gateways/restUserPermissionGateway";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class CompanyUsersModule implements Module {
  public constructor(
    private readonly authModule: AuthModule,
    private readonly router: RouterModule,
    private readonly i18nModule: I18nModule
  ) {}

  public getName(): string {
    return CompanyUsersModule.name;
  }

  public async load(): Promise<void> {
    let usersGateway: UserGateway;
    let companyGateway: CompanyGateway;
    let userPermissionGateway: UserPermissionGateway;
    let devicesGateway: DevicesGateway;
    if (ProjectUtil.isMock()) {
      usersGateway = new UserGatewayMock();
      companyGateway = new CompanyGatewayMock();
      userPermissionGateway = new UserPermissionInMemoryGateway();
      devicesGateway = new DevicesGatewayMock();
    } else {
      usersGateway = new RestUserGateway(this.authModule.getRestClientProvider());
      companyGateway = new RestCompanyGateway(this.authModule.getRestClientProvider());
      userPermissionGateway = new RestUserPermissionGateway(this.authModule.getRestClientProvider());
      devicesGateway = new RestDevicesGateway(this.authModule.getRestClientProvider());
    }

    this.router.getRouter().register(
      new Route({
        name: "users",
        title: this.i18nModule.getI18nGateway().get("companyUser.router.name"),
        urlPattern: "users",
        parent: this.router.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: CompanyUsersComponent,
        interactor: new CompanyUsersInteractor(
          this.router.getRouter(),
          this.i18nModule.getI18nGateway(),
          companyGateway
        ),
      })
    );

    this.router.getRouter().register(
      new Route({
        name: "user-edit",
        title: this.i18nModule.getI18nGateway().get("common.userEdit"),
        urlPattern: ":identifier",
        parent: this.router.getRouter().getRouteByName("users"),
      }),
      new VueRouteHandler({
        controller: UserEditViewComponent,
        interactor: new UserEditViewInteractor(
          this.router.getRouter(),
          usersGateway,
          companyGateway,
          userPermissionGateway,
          this.i18nModule.getI18nGateway(),
          devicesGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
