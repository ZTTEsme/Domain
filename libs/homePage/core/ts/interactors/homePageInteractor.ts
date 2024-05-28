import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import Company from "qnect-sdk-web/lib/company/core/ts/entities/company";
import CompanyType from "qnect-sdk-web/lib/company/core/ts/enums/companyType";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CachedUserEnvironmentGateway from "qnect-sdk-web/lib/userenvironment/core/ts/gateways/cachedUserEnvironmentGateway";
import HomePageAssemblers from "../assemblers/homePageAssembler";
import HomePagePresenter from "./homePagePresenter";
import HomePageState from "./homePageState";

export default class HomePageInteractor extends ViewInteractor<HomePagePresenter> {
  public presenter: HomePagePresenter | null = null;

  public readonly state: HomePageState = new HomePageState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateway: CompanyGateway,
    private readonly userEnvironmentGateway: CachedUserEnvironmentGateway
  ) {
    super(router);
  }

  public async onLoad(): Promise<void> {
    const companies: Company[] = await this.companyGateway.getCompanies();
    this.state.showCompaniesMenue =
      companies.length > 1 ||
      !this.seletedCompanyIsOfTypeCustomer(this.userEnvironmentGateway.getActiveCompanyId(), companies);
  }

  public seletedCompanyIsOfTypeCustomer(selectedCompanyId: number | null, companies: Company[]): boolean {
    const company: Company | undefined = companies.find((company) => company.id === selectedCompanyId);
    return company && company.type === CompanyType.CUSTOMER ? true : false;
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public startPresenting(presenter: HomePagePresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  private updateView(): void {
    this.presenter?.updateView(HomePageAssemblers.fromState(this.state, this.router, this.i18nGateway));
  }
}
