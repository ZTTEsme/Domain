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
    <div class="container home-page mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1 class="h3">{{ model.msgTitle }}</h1>
      <div v-show="model.msgNoAccess">
        <p>{{ model.msgNoAccess }}</p>
      </div>
      <template v-if="model.showMainContent">
        <div class="mb-3">
          <div class="container">
            <div class="row">
              <div class="col-2 rounded p-3 bg-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#FFF"
                    d="M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.2 320 0 392.2 0 481.3c0 17 13.8 30.7 30.7 30.7H481.3c17 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320H161.3z"
                  />
                </svg>
              </div>
              <div class="col-10">
                <table class="table">
                  <tbody>
                    <tr>
                      <th scope="row">{{ model.msgFirstName }}</th>
                      <td>{{ model.firstName }}</td>
                    </tr>
                    <tr>
                      <th scope="row">{{ model.msgLastName }}</th>
                      <td>{{ model.lastName }}</td>
                    </tr>
                    <tr>
                      <th scope="row">{{ model.msgEmail }}</th>
                      <td>{{ model.email }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="h4">{{ model.msgCompanies }}</h2>
          <ul class="list-group mb-3">
            <li class="list-group-item" v-for="connection in model.companyConnections">
              <div class="mb-1">
                <span class="fw-semibold">{{ model.msgCompanyName }}:</span> {{ connection.companyName }}
              </div>
              <div class="mb-1">
                <span class="fw-semibold me-1">{{ model.msgIsAdmin }}:</span>
                <span v-show="connection.admin"><i class="fa-solid fa-check"></i></span>
                <span v-show="!connection.admin"><i class="fa-solid fa-xmark"></i></span>
              </div>

              <div class="d-flex flex-row mb-1">
                <span class="fw-semibold me-1">{{ model.msgPakId }}:</span>
                <div>
                  <span>
                    <div class="dropdown fw-normal">
                      <button
                        class="form-select form-select-sm text-start text-nowrap"
                        type="button"
                        data-bs-popper-config='{"strategy":"fixed"}'
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
                            <label class="form-check-label text-nowrap me-2">
                              {{ model.msgUnassignPakId }}
                            </label>
                            <button
                              type="button"
                              class="btn btn-outline-primary btn-sm"
                              @click="() => interactor.assignPakId(connection.companyId, undefined)"
                            >
                              {{ model.msgUnassign }}
                            </button>
                          </div>
                          <div class="form-check ps-0" v-for="(pakLogin, pakLoginIndex) in connection.pakLogins">
                            <label
                              class="form-check-label text-nowrap me-2"
                              :for="'company' + connection.companyId + '-pakLogin' + pakLoginIndex"
                            >
                              {{ pakLogin.description }}
                            </label>
                            <button
                              type="button"
                              class="btn btn-outline-primary btn-sm"
                              :id="'company' + connection.companyId + '-pakLogin' + pakLoginIndex"
                              @click="() => interactor.assignPakId(connection.companyId, pakLogin.pakId)"
                            >
                              {{ model.msgAssign }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              <div class="d-flex flex-row mb-3">
                <div>
                  <span class="fw-semibold me-1">{{ model.msgRoles }}:</span>
                </div>
                <div>
                  <span>
                    <div class="dropdown fw-normal">
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
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>

      <section>
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
      </section>
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
