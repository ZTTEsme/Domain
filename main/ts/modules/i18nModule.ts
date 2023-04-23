import LanguageLoader from "qnect-sdk-web/lib/i18n/browser/ts/languageLoader";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import Language from "qnect-sdk-web/lib/i18n/core/ts/language";
import LanguagesProvider from "qnect-sdk-web/lib/i18n/core/ts/languagesProvider";
import XliffI18nGateway from "qnect-sdk-web/lib/i18n/xliff/ts/gateways/xliffI18nGateway";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";
import AuthModule from "qnect-sdk-web/lib/modules/main/ts/authModule";

export default class I18nModule implements Module {
  private readonly authModule: AuthModule;
  private i18ngateway!: I18nGateway;
  private languagesProvider!: LanguagesProvider;

  public constructor(authModule: AuthModule) {
    this.authModule = authModule;
  }

  public getName(): string {
    return I18nModule.name;
  }

  public getI18nGateway(): I18nGateway {
    return this.i18ngateway;
  }

  public getLanguagesProvider(): LanguagesProvider {
    return this.languagesProvider;
  }

  public async load(): Promise<void> {
    this.i18ngateway = new XliffI18nGateway(LanguageLoader.getI18nConfig(), this.authModule.getRestClientProvider());

    await LanguageLoader.initLanguage(
      this.i18ngateway,
      this.authModule.getAuthUserDataProvider().getAuthUserData().locale
    );
    this.languagesProvider = new LanguagesProvider([
      new Language({ key: "de-DE", label: "Deutsch", machineTranslated: true }),
      new Language({ key: "en-US", label: "English" }),
      new Language({ key: "zh-CN", label: "中文", machineTranslated: true }),
    ]);
  }

  public async loadSecondPhase(): Promise<void> {
    // do nothing
  }
}
