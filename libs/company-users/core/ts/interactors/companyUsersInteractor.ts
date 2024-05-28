import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanyWithUsers from "qnect-sdk-web/lib/company/core/ts/entities/companyWithUsers";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanyUsersAssembler from "../assemblers/companyUsersAssembler";
import AddUserFormData from "../entities/addUserFormData";
import CompanyUsersPresenter from "./companyUsersPresenter";
import CompanyUsersState from "./companyUsersState";

export default class CompanyUsersInteractor extends ViewInteractor<CompanyUsersPresenter> {
  public validationRules: Record<string, ValidationRule[]> = {
    email: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companyUser.valid.email"),
      },
    ],
  };

  private presenter: CompanyUsersPresenter | null = null;
  private readonly state: CompanyUsersState = new CompanyUsersState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateway: CompanyGateway
  ) {
    super(router);
  }

  public startPresenting(presenter: CompanyUsersPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    this.state.companies = await this.companyGateway.getCompanies();

    if (this.state.companies.length >= 1) {
      this.state.selectedCompanyId = this.state.companies[0].id;
      await this.loadUsers();
    } else {
      const companyId: number = parseInt(String(this.router.getPathParams().get("id")));
      if (isNaN(companyId)) {
        this.state.selectedCompanyId = null;
      } else {
        this.state.selectedCompanyId = companyId;
        await this.loadUsers();
      }
    }

    this.updateView();
  }

  public onUnload(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public updateView(): void {
    this.presenter?.updateView(CompanyUsersAssembler.fromState(this.state, this.router, this.i18nGateway));
  }

  public async changeCompany(companyId: number): Promise<void> {
    this.state.selectedCompanyId = companyId;
    const company: CompanyWithUsers = await this.companyGateway.getCompany(companyId);
    this.state.users = company.users;
    this.updateView();
  }

  public openEditUser(userId: string): void {
    this.router.loadRoute(this.router.getRouteByName("user-edit"), new Map<string, string>([["identifier", userId]]));
  }

  public openDeleteUserDialog(userId: string): void {
    this.state.dialog.openDeleteUserDialog = true;
    this.state.dialog.currentDeleteCompanyUserId = userId;
    this.updateView();
  }

  public openAddUserDialog(): void {
    this.state.validAddCompanyUserFormErrors = {};
    this.state.dialog.showAddUserSuccessMessage = false;
    this.state.dialog.showAddUserFailureMessage = false;
    this.state.dialog.openAddUserDialog = true;
    this.updateView();
  }

  public closeAddCompanyUserDialog(): void {
    this.state.dialog.openAddUserDialog = false;
    this.updateView();
  }

  public async addUserToCompany(addUserFormData: AddUserFormData): Promise<void> {
    this.state.addUserFormData = addUserFormData;

    this.state.validAddCompanyUserFormErrors = CommonUtils.validateForm(
      this.state.addUserFormData,
      this.validationRules,
      this.state.validAddCompanyUserErrors,
      this.state.validAddCompanyUserFormErrors
    );

    if (CommonUtils.isObjectEmpty(this.state.validAddCompanyUserFormErrors)) {
      try {
        await this.companyGateway.inviteUserToCompany(
          Number(this.state.selectedCompanyId),
          this.state.addUserFormData.email,
          this.state.addUserFormData.admin
        );

        this.state.dialog.showAddUserFailureMessage = false;
        this.state.dialog.showAddUserSuccessMessage = true;
        const company: CompanyWithUsers = await this.companyGateway.getCompany(Number(this.state.selectedCompanyId));
        this.state.users = company.users;
        this.state.addUserFormData = new AddUserFormData();
      } catch (error) {
        this.state.dialog.showAddUserFailureMessage = true;
        this.state.dialog.showAddUserSuccessMessage = false;
      } finally {
        this.state.isLoading = false;
      }
    }

    this.updateView();
  }

  public closeDeleteUserDialog(): void {
    this.state.dialog.openDeleteUserDialog = false;
    this.state.dialog.showDeleteUserSuccessMessage = false;
    this.state.dialog.showDeleteUserFailureMessage = false;
    this.updateView();
  }

  public async deleteCompanyUser(userId: string): Promise<void> {
    try {
      this.updateView();
      if (userId === undefined) {
        this.state.dialog.showDeleteUserFailureMessage = true;
        this.state.dialog.showDeleteUserSuccessMessage = false;
        this.updateView();
      } else {
        await this.companyGateway.removeUserFromCompany(Number(this.state.selectedCompanyId), userId);
        this.state.dialog.showDeleteUserFailureMessage = false;
        this.state.dialog.showDeleteUserSuccessMessage = true;
        const company: CompanyWithUsers = await this.companyGateway.getCompany(Number(this.state.selectedCompanyId));
        this.state.users = company.users;
        this.updateView();
      }
    } catch (error) {
      this.state.dialog.showDeleteUserFailureMessage = true;
      this.state.dialog.showDeleteUserSuccessMessage = false;
      this.updateView();
    }
  }

  private async loadUsers(): Promise<void> {
    if (this.state.selectedCompanyId !== null) {
      const company: CompanyWithUsers = await this.companyGateway.getCompany(this.state.selectedCompanyId);
      this.state.selectedCompanyId = company.id;
      this.state.users = company.users;
    }
  }
}
