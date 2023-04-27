import AuthUserDataProvider from "qnect-sdk-web/lib/auth/core/ts/authUserDataProvider";
import AuthGateway from "qnect-sdk-web/lib/auth/core/ts/gateways/authGateway";
import AxiosRestClientProvider from "qnect-sdk-web/lib/auth/rest/ts/axiosRestClientProvider";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";

declare global {
  interface Window {
    initQnectFrame: (options: {
      brandingText: string | undefined;
      brandingLogo: string | undefined;
      authUserDataProvider: AuthUserDataProvider;
      authGateway: AuthGateway;
      axiosRestClientProvider: AxiosRestClientProvider;
      updateAppConfigsHook: VoidFunction | undefined;
      i18nPrefix: string | undefined;
    }) => Promise<void>;
  }
}

export default class FrameModule implements Module {
  public constructor(private readonly authModule: AuthModule) {}

  public getName(): string {
    return FrameModule.name;
  }

  public async load(): Promise<void> {
    try {
      await window.initQnectFrame({
        brandingLogo: "",
        brandingText: "QNECT",
        authUserDataProvider: this.authModule.getAuthUserDataProvider(),
        authGateway: this.authModule.getAuthGateway(),
        axiosRestClientProvider: this.authModule.getRestClientProvider(),
        updateAppConfigsHook: () => {
          // do nothing
        },
        i18nPrefix: "http://192.168.10.165:8080",
      });
    } catch (error) {
      console.error("Could not init qnect frame.", error);
    }
  }

  public async loadSecondPhase(): Promise<void> {
    // do nothing
  }
}
