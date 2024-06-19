import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import UserEditViewInteractor from "../../core/ts/interactors/userEditViewInteractor";
import UserEditViewPresenter from "../../core/ts/interactors/userEditViewPresenter";
import UserEditViewModel from "../../core/ts/models/userEditViewModel";

@Component({
  name: "UserEditViewComponent",
  components: {
    toast: ToastComponent,
    modal: ModalComponent,
  },
  template: `
    <div class="container mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1>{{ model.msgTitle }}</h1>

      <div v-show="model.msgNoAccess">
        <p>{{ model.msgNoAccess }}</p>
      </div>

      <toast :show="model.showPakIdUpdateSucceededMsg" color="success">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgPakIdUpdateSucceeded }}</span>
      </toast>

      <toast :show="model.showPakIdUpdateFailedMsg" color="danger">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgPakIdUpdateFailed }}</span>
      </toast>

      <toast :show="model.showRoleUpdateSucceededMsg" color="success">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgRoleUpdateSucceeded }}</span>
      </toast>

      <toast :show="model.showRoleUpdateFailedMsg" color="danger">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgRoleUpdateFailed }}</span>
      </toast>

      <template v-if="model.showMainContent">
        <div class="mb-3">
          <div class="row">
            <div class="col-5 col-sm-4 col-lg-2">
              <div class="p-3 p-md-4 p-xl-5 rounded bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#FFF"
                    d="M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.2 320 0 392.2 0 481.3c0 17 13.8 30.7 30.7 30.7H481.3c17 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320H161.3z"
                  />
                </svg>
              </div>
            </div>
            <div class="col-7 col-sm-8 col-md-6 col-xl-4">
              <ul class="table-list">
                <li class="table-list__row">
                  <div class="table-list__cell table-list__cell--header-always">{{ model.msgFirstName }}</div>
                  <div class="table-list__cell">{{ model.firstName }}</div>
                </li>
                <li class="table-list__row">
                  <div class="table-list__cell table-list__cell--header-always">{{ model.msgLastName }}</div>
                  <div class="table-list__cell">{{ model.lastName }}</div>
                </li>
                <li class="table-list__row">
                  <div class="table-list__cell table-list__cell--header-always">{{ model.msgEmail }}</div>
                  <div class="table-list__cell">{{ model.email }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h2 class="h4">{{ model.msgCompanies }}</h2>

          <ul class="table-list">
            <li class="table-list__row table-list__row--header">
              <div class="table-list__cell">{{ model.msgCompanyName }}</div>
              <div class="table-list__cell">{{ model.msgIsAdmin }}</div>
              <div class="table-list__cell">{{ model.msgPakId }}</div>
              <div class="table-list__cell">{{ model.msgRoles }}</div>
            </li>
            <li class="table-list__row" v-for="connection in model.companyConnections">
              <div class="table-list__cell">{{ connection.companyName }}</div>
              <div class="table-list__cell">
                <i class="fa-solid" :class="connection.admin ? 'fa-check' : 'fa-xmark'"></i>
              </div>
              <div class="table-list__cell">
                <div class="dropdown">
                  <button
                    class="form-select form-select-sm text-start text-nowrap"
                    type="button"
                    data-bs-popper-config='{ "strategy": "fixed" }'
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                  >
                    {{ connection.pakSummary }}
                  </button>
                  <div class="dropdown-menu p-0">
                    <div class="p-2">
                      <div class="form-check ps-0" v-show="connection.pakLogins.length === 0">
                        <label class="form-check-label text-nowrap fst-italic me-2">
                          {{ model.msgNoPakLoginsFound }}
                        </label>
                      </div>
                      <div class="form-check ps-0" v-show="connection.pakIdSet">
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-sm me-2"
                          :id="'company-' + connection.companyId + '-pak-login-unassign'"
                          @click="() => interactor.assignPakId(connection.companyId, undefined)"
                        >
                          {{ model.msgUnassign }}
                        </button>
                        <label
                          class="form-check-label text-nowrap"
                          :for="'company-' + connection.companyId + '-pak-login-unassign'"
                        >
                          {{ model.msgUnassignPakId }}
                        </label>
                      </div>
                      <div class="form-check ps-0" v-for="(pakLogin, pakLoginIndex) in connection.pakLogins">
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-sm me-2"
                          :id="'company-' + connection.companyId + '-pak-login-' + pakLoginIndex"
                          @click="() => interactor.assignPakId(connection.companyId, pakLogin.pakId)"
                        >
                          {{ model.msgAssign }}
                        </button>
                        <label
                          class="form-check-label text-nowrap"
                          :for="'company-' + connection.companyId + '-pak-login-' + pakLoginIndex"
                        >
                          {{ pakLogin.description }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-list__cell">
                <div class="dropdown">
                  <button
                    class="form-select form-select-sm text-start text-nowrap"
                    type="button"
                    data-bs-popper-config='{"strategy":"fixed"}'
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                  >
                    {{ connection.roleSummary }}
                  </button>
                  <div class="dropdown-menu p-0">
                    <div class="p-2">
                      <div class="form-check ps-0" v-show="connection.roles.length === 0">
                        <label class="form-check-label text-nowrap fst-italic me-2">
                          {{ model.msgNoRolesFound }}
                        </label>
                      </div>
                      <div class="form-check" v-for="(role, roleIndex) in connection.roles">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="role.selected"
                          @click="() => interactor.toggleRoleAssignment(connection.companyId, role.id)"
                          :id="'company' + connection.companyId + '-role' + roleIndex"
                        />
                        <label
                          class="form-check-label text-nowrap"
                          :for="'company' + connection.companyId + '-role' + roleIndex"
                        >
                          {{ role.alias }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  `,
})
export default class UserEditViewComponent extends Vue implements UserEditViewPresenter {
  @Prop
  private readonly interactor!: UserEditViewInteractor;
  private model: UserEditViewModel = new UserEditViewModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: UserEditViewModel): void {
    this.model = model;
  }
}
