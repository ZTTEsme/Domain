import ModuleLoader from "qnect-sdk-web/lib/modules/core/ts/moduleLoader";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyModule from "./modules/companyModule";
import CompanySiteModule from "./modules/companySiteModule";
import I18nModule from "./modules/i18nModule";
import RouterModule from "./modules/routerModule";

import RestClientModule from "qnect-sdk-web/lib/modules/main/ts/restClientModule";
import UserEnvironmentModule from "qnect-sdk-web/lib/modules/main/ts/userEnvironmentModule";
import CompanySiteUsersModule from "./modules/companySiteUsersModule";
import FrameModule from "./modules/frameModule";
import HomePageModule from "./modules/homePageModule";

export default class ModuleFeeder {
  public static registerAllModules(moduleLoader: ModuleLoader): void {
    const restClientModule: RestClientModule = new RestClientModule();
    moduleLoader.registerModule(restClientModule);

    const authModule: AuthModule = new AuthModule(restClientModule);
    moduleLoader.registerModule(authModule);

    const userEnvironmentModule: UserEnvironmentModule = new UserEnvironmentModule(restClientModule);
    moduleLoader.registerModule(userEnvironmentModule);

    const i18nModule: I18nModule = new I18nModule(authModule);
    moduleLoader.registerModule(i18nModule);

    const routerModule: RouterModule = new RouterModule();
    moduleLoader.registerModule(routerModule);

    const frameModule: FrameModule = new FrameModule(authModule);
    moduleLoader.registerModule(frameModule);

    const homePageModule: HomePageModule = new HomePageModule(authModule, routerModule, i18nModule);
    moduleLoader.registerModule(homePageModule);

    const companyModule: CompanyModule = new CompanyModule(authModule, routerModule, i18nModule);
    moduleLoader.registerModule(companyModule);

    const companySiteModule: CompanySiteModule = new CompanySiteModule(authModule, routerModule, i18nModule);
    moduleLoader.registerModule(companySiteModule);

    const companySiteUsersModule: CompanySiteUsersModule = new CompanySiteUsersModule(
      authModule,
      routerModule,
      i18nModule
    );
    moduleLoader.registerModule(companySiteUsersModule);
  }
}
