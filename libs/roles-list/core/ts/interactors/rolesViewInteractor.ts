import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import NotPermittedError from "qnect-sdk-web/lib/common/core/ts/errors/notPermittedError";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import UserPermissionGateway from "../../../../roles-common/core/ts/gateways/userPermissionGateway";
import RolesViewModelAssembler from "../assemblers/rolesViewModelAssembler";
import RolesViewPresenter from "./rolesViewPresenter";
import RolesViewState from "./rolesViewState";

export default class RolesViewInteractor extends ViewInteractor<RolesViewPresenter> {
  private presenter: RolesViewPresenter | null = null;
  private readonly state: RolesViewState;

  public constructor(
    router: Router,
    private readonly userPermissionService: UserPermissionGateway,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateway: CompanyGateway
  ) {
    super(router);
    this.state = new RolesViewState();
  }

  public startPresenting(presenter: RolesViewPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    this.state.deletedSuccessful = this.router.getQueryParams().get("delete") === "success";
    try {
      await this.loadCompanies();
      await this.loadRoles();
    } catch (error) {
      if (error instanceof NotPermittedError) {
        this.noAccess();
      }
    }
  }

  public async onUnload(): Promise<void> {
    // Do nothing
  }

  public async changeCompany(companyId: number | undefined): Promise<void> {
    this.state.selectedCompanyId = companyId;
    this.state.getRolesFailed = false;
    this.state.roles = [];
    this.updateView();

    await this.loadRoles();
    this.updateView();
  }

  private noAccess(): void {
    this.state.noAccess = true;
    this.state.noModifyAccess = true;
  }

  private async loadCompanies(): Promise<void> {
    this.state.companies = await this.companyGateway.getCompanies();

    if (this.state.companies.length > 0 && this.state.companies[0].id !== null) {
      this.state.selectedCompanyId = this.state.companies[0].id;
    }
  }

  private async loadRoles(): Promise<void> {
    if (this.state.selectedCompanyId !== undefined) {
      try {
        this.state.roles = await this.userPermissionService.getRoles(this.state.selectedCompanyId);
        this.state.getRolesFailed = false;
      } catch (error) {
        this.state.getRolesFailed = true;
      }
    }
  }

  private updateView(): void {
    if (this.presenter) {
      this.presenter.updateView(RolesViewModelAssembler.fromState(this.state, this.router, this.i18nGateway));
    }
  }
}
