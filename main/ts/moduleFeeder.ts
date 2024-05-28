import ModuleLoader from "qnect-sdk-web/lib/modules/core/ts/moduleLoader";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import CompanyModule from "./modules/companyModule";
import CompanyUsersModule from "./modules/companyUsersModule";
import FrameModule from "./modules/frameModule";
import HomePageModule from "./modules/homePageModule";
import I18nModule from "./modules/i18nModule";
import RolesModule from "./modules/rolesModule";
import RouterModule from "./modules/routerModule";

export default class ModuleFeeder {
  public static registerAllModules(moduleLoader: ModuleLoader): void {
    const authModule: AuthModule = new AuthModule();
    moduleLoader.registerModule(authModule);

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

    const companyUsersModule: CompanyUsersModule = new CompanyUsersModule(authModule, routerModule, i18nModule);
    moduleLoader.registerModule(companyUsersModule);

    const rolesModule: RolesModule = new RolesModule(authModule, routerModule, i18nModule);
    moduleLoader.registerModule(rolesModule);
  }
}
