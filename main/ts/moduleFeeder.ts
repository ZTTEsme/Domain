import ModuleLoader from "qnect-sdk-web/lib/modules/core/ts/moduleLoader";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";
import I18nModule from "./modules/i18nModule";
import RouterModule from "./modules/routerModule";
import CompanyModule from "./modules/companyModule";
import CompanySiteModule from "./modules/companySiteModule";

import FrameModule from "./modules/frameModule";
import CompanySiteUsersModule from "./modules/companySiteUsersModule";

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

    const companyModule:CompanyModule = new CompanyModule(
      authModule,
      routerModule,
      i18nModule
    );
    moduleLoader.registerModule(companyModule);

    const companySiteModule:CompanySiteModule = new CompanySiteModule(
      authModule,
      routerModule,
      i18nModule
    );
    moduleLoader.registerModule(companySiteModule);

    const companySiteUsersModule:CompanySiteUsersModule = new CompanySiteUsersModule(
      authModule,
      routerModule,
      i18nModule
    );
    moduleLoader.registerModule(companySiteUsersModule);
  }
}
