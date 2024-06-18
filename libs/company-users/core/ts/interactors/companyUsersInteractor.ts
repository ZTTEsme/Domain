import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import UserInputModel from "../../../../company/core/ts/models/userInputModel";
import CompanyUsersAssembler from "../assemblers/companyUsersAssembler";
import CompanyUsersPresenter from "./companyUsersPresenter";
import CompanyUsersState from "./companyUsersState";

export default class CompanyUsersInteractor extends ViewInteractor<CompanyUsersPresenter> {
  private presenter: CompanyUsersPresenter | null = null;
  private readonly state: CompanyUsersState = new CompanyUsersState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateway: CompanyGateway
  ) {
    super(router);
  }

  public async onLoad(): Promise<void> {
    try {
      this.state.selectedCompanyId = parseInt(this.router.getQueryParams().get("id") || "") || undefined;
      this.state.companies = await this.companyGateway.getCompanies();

      if (this.state.selectedCompanyId !== undefined) {
        this.state.users = (await this.companyGateway.getCompany(this.state.selectedCompanyId)).users;
      }
    } catch (error) {
      console.warn("Could not load companies:", error);
    }
  }

  public async onUnload(): Promise<void> {
    this.state.selectedCompanyId = undefined;
    this.state.companies = [];
    this.state.users = [];
  }

  public startPresenting(presenter: CompanyUsersPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async changeCompany(companyId: number | undefined): Promise<void> {
    this.state.selectedCompanyId = companyId;
    this.state.companyLoadedWithFailure = false;

    if (companyId !== undefined) {
      this.state.isLoading = true;
      this.updateView();

      try {
        this.state.users = (await this.companyGateway.getCompany(companyId)).users;
      } catch (error) {
        this.state.companyLoadedWithFailure = true;
      }

      this.state.isLoading = false;
    }

    this.updateView();
  }

  public openRemoveUserDialog(userId: string): void {
    this.state.toRemoveUserId = userId;
    this.state.removeUserDialogOpen = true;
    this.updateView();
  }

  public closeRemoveUserDialog(): void {
    this.state.toRemoveUserId = undefined;
    this.state.removeUserDialogOpen = false;
    this.state.userRemovedWithFailure = false;
    this.state.userRemovedWithSuccess = false;
    this.updateView();
  }

  public async removeCompanyUser(): Promise<void> {
    this.state.userRemovedWithFailure = false;
    this.state.userRemovedWithSuccess = false;

    if (this.state.selectedCompanyId !== undefined && this.state.toRemoveUserId !== undefined) {
      this.state.isLoading = true;
      this.updateView();

      try {
        await this.companyGateway.removeUserFromCompany(this.state.selectedCompanyId, this.state.toRemoveUserId);
        this.state.users = (await this.companyGateway.getCompany(this.state.selectedCompanyId)).users;
        this.state.userRemovedWithSuccess = true;
      } catch (error) {
        this.state.userRemovedWithFailure = true;
      }

      this.state.isLoading = false;
    }

    this.updateView();
  }

  public openAddUserDialog(): void {
    this.state.addUserDialogOpen = true;
    this.state.addUserInput = new UserInputModel();
    this.updateView();
  }

  public closeAddUserDialog(): void {
    this.state.addUserDialogOpen = false;
    this.state.userAddedWithSuccess = false;
    this.state.userAddedWithFailure = false;
    this.updateView();
  }

  public async addUserToCompany(userInput: UserInputModel): Promise<void> {
    this.state.addUserInput = new UserInputModel(userInput);
    this.state.userAddedWithFailure = false;
    this.state.userAddedWithSuccess = false;

    if (this.state.addUserInput.isValid() && this.state.selectedCompanyId !== undefined) {
      this.state.isLoading = true;
      this.updateView();

      try {
        await this.companyGateway.inviteUserToCompany(
          this.state.selectedCompanyId,
          this.state.addUserInput.email,
          this.state.addUserInput.isAdmin
        );
        this.state.userAddedWithSuccess = true;
      } catch (error) {
        this.state.userAddedWithFailure = true;
      }

      this.state.isLoading = false;
    }

    this.updateView();
  }

  private updateView(): void {
    this.presenter?.updateView(CompanyUsersAssembler.fromState(this.state, this.router, this.i18nGateway));
  }
}
