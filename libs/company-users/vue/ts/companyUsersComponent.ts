import { Component, Prop, Vue } from "vue-facing-decorator";
import CompanyUsersInteractor from "../../core/ts/interactors/companyUsersInteractor";
import CompanyUsersPresenter from "../../core/ts/interactors/companyUsersPresenter";
import CompanyUsersModel from "../../core/ts/models/companyUsersModel";

@Component({
  name: "CompanyUserComponent",
  template: `
    <div class="container mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1>{{ model.msgTitle }}</h1>

      <toast :show="model.showSelectCompanyErrorMessage" color="danger">
        <i class="fa-solid fa-triangle-exclamation"></i>
        {{ model.msgSelectCompanyErrorMessage }}
      </toast>

      <div class="card mb-3">
        <div class="card-body">
          <label for="filter-company" class="form-label">{{ model.msgFilterTitle }}</label>
          <select
            class="form-select"
            id="filter-company"
            v-model="model.selectedCompanyId"
            @change="() => interactor.changeCompany(model.selectedCompanyId)"
          >
            <option :value="undefined" disabled>{{ model.msgNoSelectedCompany }}</option>
            <option v-for="company in model.companies" :value="company.id">{{ company.alias }}</option>
          </select>
        </div>
      </div>

      <div v-show="model.showLoadingIndicator" class="card">
        <div class="card-body text-center">
          <i class="fa-solid fa-circle-notch fa-spin fs-1"></i>
        </div>
      </div>
      <div v-show="!model.showLoadingIndicator" class="card">
        <div class="card-body">
          <button type="button" class="btn btn-primary mb-3" @click="() => interactor.openAddUserDialog()">
            <i class="fa-solid fa-plus me-1"></i>{{ model.msgInviteUserAction }}
          </button>

          <ul class="table-list table-list--striped mb-0">
            <li class="table-list__row table-list__row--header">
              <div class="table-list__cell">{{ model.msgUserAlias }}</div>
              <div class="table-list__cell">{{ model.msgUserEmail }}</div>
              <div class="table-list__cell">{{ model.msgUserIsAdmin }}</div>
              <div class="table-list__cell">{{ model.msgUserActions }}</div>
            </li>
            <li v-if="model.users.length === 0" class="table-list__caption">{{ model.msgNoUsers }}</li>
            <li v-for="user in model.users" class="table-list__row">
              <div class="table-list__cell">{{ user.alias }}</div>
              <div class="table-list__cell">{{ user.email }}</div>
              <div class="table-list__cell ps-md-5">
                <i
                  class="fa-solid"
                  :class="user.isAdmin ? 'fa-check' : 'fa-xmark'"
                  :aria-description="user.isAdmin ? model.msgUserIsAdminTrue : model.msgUserIsAdminFalse"
                ></i>
                <span class="d-md-none ms-1">{{
                  user.isAdmin ? model.msgUserIsAdminTrue : model.msgUserIsAdminFalse
                }}</span>
              </div>
              <div class="table-list__cell">
                <a class="btn btn-outline-primary btn-sm me-1 mb-1" :href="user.link">
                  <i class="fa-solid fa-pen-to-square"></i>
                  {{ model.msgUserEditAction }}
                </a>

                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm me-1 mb-1"
                  @click="() => interactor.openRemoveUserDialog(user.id)"
                >
                  <i class="fa-regular fa-trash-can"></i>
                  {{ model.msgUserDeleteAction }}
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <modal
        name="add-user"
        :show="model.showUserDialog"
        :title="model.msgUserDialog"
        :abortFunction="() => interactor.closeAddUserDialog()"
      >
        <alert :show="model.showAddUserSuccessMessage" color="success" icon="fa-solid fa-check">
          {{ model.msgAddUserSuccessMessage }}
        </alert>
        <alert :show="model.showAddUserErrorMessage" color="danger" icon="fa-solid fa-triangle-exclamation">
          {{ model.msgAddUserErrorMessage }}
        </alert>

        <form>
          <div class="mb-3">
            <label for="input-user-email" class="form-label">{{ model.msgUserEmail }}</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid': !!model.formErrors.email}"
              id="input-user-email"
              v-model="model.userInput.email"
            />
            <div class="invalid-feedback" v-show="!!model.formErrors.email">{{ model.formErrors.email }}</div>
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="input-user-admin" v-model="model.userInput.isAdmin" />
            <label class="form-check-label" for="input-user-admin">{{ model.msgUserIsAdminExplanation }}</label>
          </div>
        </form>

        <template #footer>
          <button type="button" class="btn btn-primary" @click="() => interactor.addUserToCompany(model.userInput)">
            {{ model.msgUserSaveAction }}
          </button>
        </template>
      </modal>

      <modal
        name="delete-user"
        :show="model.showUserRemoveDialog"
        :title="model.msgRemoveUserDialog"
        :abortFunction="() => interactor.closeRemoveUserDialog()"
      >
        <alert :show="model.showRemoveSuccessMessage" color="success" icon="fa-solid fa-check">{{
          model.msgRemoveSuccessMessage
        }}</alert>
        <alert :show="model.showRemoveErrorMessage" color="danger" icon="fa-solid fa-triangle-exclamation">{{
          model.msgRemoveErrorMessage
        }}</alert>

        <p>{{ model.msgRemoveUserDialogText }}</p>

        <template #footer>
          <button type="button" class="btn btn-danger" @click="() => interactor.removeCompanyUser()">
            {{ model.msgUserDeleteAction }}
          </button>
        </template>
      </modal>
    </div>
  `,
})
export default class CompanyUsersComponent extends Vue implements CompanyUsersPresenter {
  @Prop
  private readonly interactor!: CompanyUsersInteractor;

  private model: CompanyUsersModel = new CompanyUsersModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: CompanyUsersModel): void {
    this.model = model;
  }
}
