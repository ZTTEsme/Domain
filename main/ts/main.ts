import ModuleLoader from "qnect-sdk-web/lib/modules/core/ts/moduleLoader";
import ModuleFeeder from "./moduleFeeder";

void startApp();

async function startApp(): Promise<void> {
  const moduleLoader: ModuleLoader = new ModuleLoader();
  ModuleFeeder.registerAllModules(moduleLoader);
  await moduleLoader.loadModules();
}
