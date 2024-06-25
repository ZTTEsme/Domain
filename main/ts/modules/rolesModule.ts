import Route from "cloos-vue-router/lib/core/route";
import VueRouteHandler from "cloos-vue-router/lib/vue/vueRouteHandler";
import AppConfigGateway from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGateway";
import AppConfigGatewayMock from "qnect-sdk-web/lib/apps/core/ts/gateways/appConfigGatewayMock";
import RestAppConfigGateway from "qnect-sdk-web/lib/apps/rest/ts/gateways/restAppConfigGateway";
import ProjectUtil from "qnect-sdk-web/lib/common/browser/ts/projectUtil";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import CompanyGatewayMock from "qnect-sdk-web/lib/company/core/ts/gateways/companyGatewayMock";
import RestCompanyGateway from "qnect-sdk-web/lib/company/rest/ts/gateways/restCompanyGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import RolesEditViewInteractor from "../../../libs/role-edit/core/ts/interactors/rolesEditViewInteractor";
import RolesEditViewComponent from "../../../libs/role-edit/vue/ts/rolesEditViewComponent";
import UserPermissionInMemoryGateway from "../../../libs/roles-common/core/ts/gateways/inmemory/userPermissionInMemoryGateway";
import UserPermissionGateway from "../../../libs/roles-common/core/ts/gateways/userPermissionGateway";
import RestUserPermissionGateway from "../../../libs/roles-common/rest/ts/gateways/restUserPermissionGateway";
import RolesViewInteractor from "../../../libs/roles-list/core/ts/interactors/rolesViewInteractor";
import RolesViewComponent from "../../../libs/roles-list/vue/ts/rolesViewComponent";
import I18nModule from "./i18nModule";
import RouterModule from "./routerModule";

export default class RolesModule implements Module {
  public constructor(
    private readonly authModule: AuthModule,
    private readonly router: RouterModule,
    private readonly i18nModule: I18nModule
  ) {}

  public getName(): string {
    return RolesModule.name;
  }

  public async load(): Promise<void> {
    const userPermissionGatway: UserPermissionGateway = ProjectUtil.isMock()
      ? new UserPermissionInMemoryGateway()
      : new RestUserPermissionGateway(this.authModule.getRestClientProvider());
    const companyGateway: CompanyGateway = ProjectUtil.isMock()
      ? new CompanyGatewayMock()
      : new RestCompanyGateway(this.authModule.getRestClientProvider());
    const appConfigGateway: AppConfigGateway = ProjectUtil.isMock()
      ? new AppConfigGatewayMock()
      : new RestAppConfigGateway(this.authModule.getRestClientProvider());

    this.router.getRouter().register(
      new Route({
        name: "roles",
        title: this.i18nModule.getI18nGateway().get("roles.title"),
        urlPattern: "roles",
        parent: this.router.getRouter().getRouteByName("home"),
      }),
      new VueRouteHandler({
        controller: RolesViewComponent,
        interactor: new RolesViewInteractor(
          this.router.getRouter(),
          userPermissionGatway,
          this.i18nModule.getI18nGateway(),
          companyGateway
        ),
      })
    );

    this.router.getRouter().register(
      new Route({
        name: "edit-role",
        title: this.i18nModule.getI18nGateway().get("role.title"),
        urlPattern: ":identifier",
        parent: this.router.getRouter().getRouteByName("roles"),
      }),
      new VueRouteHandler({
        controller: RolesEditViewComponent,
        interactor: new RolesEditViewInteractor(
          this.router.getRouter(),
          userPermissionGatway,
          this.i18nModule.getI18nGateway(),
          appConfigGateway
        ),
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    //
  }
}
