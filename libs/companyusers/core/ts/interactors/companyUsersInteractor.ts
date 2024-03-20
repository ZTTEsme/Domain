import Router from "cloos-vue-router/lib/core/router";
import ViewInteractor from "cloos-vue-router/lib/core/viewInteractor";
import CompanyGateway from "qnect-sdk-web/lib/company/core/ts/gateways/companyGateway";
import I18nGateway from "qnect-sdk-web/lib/i18n/core/ts/gateways/i18nGateway";
import CommonUtils from "../../../../common/utils/ts/commonUtils";
import CompanyUsersAssembler from "../assemblers/companyUsersAssembler";
import AddUserFormData from "../entities/addUserFormData";
import CompanyUsersModel from "../models/companyUsersModel";
import CompanyUsersPresenter from "./companyUsersPresenter";
import CompanyUsersState from "./companyUsersState";

export default class CompanyUsersInteractor extends ViewInteractor<CompanyUsersPresenter> {
  public rulesForAddCompanySiteUser: Record<string, ValidationRule[]> = {
    email: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companySiteUser.valid.email"),
      },
    ],
    role: [
      {
        validator: (value: string): boolean => value.length > 0,
        message: this.i18nGateway.get("companySiteUser.valid.role"),
      },
    ],
  };

  private presenter: CompanyUsersPresenter | null = null;
  private readonly state: CompanyUsersState = new CompanyUsersState();

  public constructor(
    router: Router,
    private readonly i18nGateway: I18nGateway,
    private readonly companyGateWay: CompanyGateway
  ) {
    super(router);
  }

  public startPresenting(presenter: CompanyUsersPresenter): void {
    this.presenter = presenter;
    this.updateView();
  }

  public async onLoad(): Promise<void> {
    this.state.companies = await this.companyGateWay.getCompanies();
    const companyId: number = parseInt(String(this.router.getPathParams().get("id")));
    if (isNaN(companyId)) {
      this.state.selectedCompanyId = null;
    } else {
      this.state.companyWithUsers = await this.companyGateWay.getCompany(companyId);
      this.state.selectedCompanyId = this.state.companyWithUsers.id;
      this.state.users = this.state.companyWithUsers.users;
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
    this.state.companyWithUsers = await this.companyGateWay.getCompany(companyId);
    this.state.users = this.state.companyWithUsers.users;
    this.updateView();
  }

  public changePageSize(model: CompanyUsersModel): void {
    if (this.state.pageInfo.pageSize !== this.state.pageInfo.currentPageSize) {
      this.state.pageInfo.pageNo = 1;
      this.state.pageInfo.pageSize = model.pageInfo.pageSize;
      this.state.pageInfo.currentPageSize = model.pageInfo.pageSize;
      this.updateView();
    }
  }

  public changePage(pageNo: number): void {
    this.state.pageInfo.pageNo = pageNo;
    this.updateView();
  }

  public openDeleteUserDialog(userId: string): void {
    this.state.dialog.openDeleteUserDialog = true;
    this.state.dialog.currentDeleteCompanySiteUserId = userId;
    this.updateView();
  }

  public openAddUserDialog(): void {
    this.state.validAddCompanySiteUserFormErrors = {};
    this.state.dialog.showAddUserSuccessMessage = false;
    this.state.dialog.showAddUserFailureMessage = false;
    this.state.dialog.openAddUserDialog = true;
    this.updateView();
  }

  public closeAddCompanySiteUserDialog(): void {
    this.state.dialog.openAddUserDialog = false;
    this.updateView();
  }

  public async addCompanySiteUser(addUserFormData: AddUserFormData): Promise<void> {
    this.state.addUserFormData = addUserFormData;

    this.state.validAddCompanySiteUserFormErrors = CommonUtils.validateForm(
      this.state.addUserFormData,
      this.rulesForAddCompanySiteUser,
      this.state.validAddCompanySiteUserErrors,
      this.state.validAddCompanySiteUserFormErrors
    );

    if (CommonUtils.isObjectEmpty(this.state.validAddCompanySiteUserFormErrors)) {
      try {
        await this.companyGateWay.inviteUserToCompany(
          Number(this.state.selectedCompanyId),
          this.state.addUserFormData.email,
          this.state.addUserFormData.role
        );

        this.state.dialog.showAddUserFailureMessage = false;
        this.state.dialog.showAddUserSuccessMessage = true;
        this.state.companyWithUsers = await this.companyGateWay.getCompany(Number(this.state.selectedCompanyId));
        this.state.users = this.state.companyWithUsers.users;
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

  public async deleteCompanySiteUser(userId: string): Promise<void> {
    try {
      this.updateView();
      if (userId === undefined) {
        this.state.dialog.showDeleteUserFailureMessage = true;
        this.state.dialog.showDeleteUserSuccessMessage = false;
        this.updateView();
      } else {
        await this.companyGateWay.removeUserFromCompany(Number(this.state.selectedCompanyId), userId);
        this.state.dialog.showDeleteUserFailureMessage = false;
        this.state.dialog.showDeleteUserSuccessMessage = true;
        this.state.companyWithUsers = await this.companyGateWay.getCompany(Number(this.state.selectedCompanyId));
        this.state.users = this.state.companyWithUsers.users;
        this.updateView();
      }
    } catch (error) {
      this.state.dialog.showDeleteUserFailureMessage = true;
      this.state.dialog.showDeleteUserSuccessMessage = false;
      this.updateView();
    }
  }

  public changePageForTable(pageNo: number, pageSize: number): void {
    console.log(pageNo);
    console.log(pageSize);
  }

  public sort(field: string, type: string): void {
    console.log(field);
    console.log(type);
  }
}
