import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import CompanyUsersInteractor from "../../core/ts/interactors/companyUsersInteractor";
import CompanyUsersPresenter from "../../core/ts/interactors/companyUsersPresenter";
import CompanyUsersModel from "../../core/ts/models/companyUsersModel";

@Component({
  name: "CompanyUserComponent",
  components: {
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb: BreadcrumbComponent,
  },
  template: `
    <div class="container company-site-users">
      <div class="wrapper">
        <!--content -->
        <section>
          <div class="page-wrapper">
            <div class="page-content">
              <!--breadcrumb-->
              <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-1">
                <div class="mt-3">
                  <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0 p-0">
                      <li>
                        <breadcrumb :items="model.breadcrumb" />
                      </li>
                    </ol>
                  </nav>
                  ö
                </div>
              </div>

              <div>
                <h1>{{ model.labelInfo.title }}</h1>
              </div>

              <div class="main row gy-2">
                <!--search-->
                <div class="col-sm-12 col-md-12 col-lg-12 mx-auto" v-show="model.showCompaniesMenue">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <form class="row g-3">
                          <div class="col-md-12 ">
                            <label for="companyId" class="form-label">{{ model.labelInfo.companyLabel }}</label>
                            <select
                              class="form-select"
                              id="companyId"
                              v-model="model.selectedCompanyId"
                              @change="interactor.changeCompany(model.selectedCompanyId)"
                            >
                              <option value="null" disabled selected>{{ model.labelInfo.selectTip }}</option>
                              <option
                                v-for="company in model.companies"
                                :key="company.id"
                                :label="company.alias"
                                :value="company.id"
                              />
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <!--table-->
                <div class="col-sm-12 col-md-12 col-lg-12 mx-auto">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <div class="row row-cols-auto g-2">
                          <div class="col">
                            <button
                              type="button"
                              class="btn btn-outline-success btn-sm me-2"
                              :disabled="model.selectedCompanyId ===null || model.selectedCompanyId === null"
                              @click="() => interactor.openAddUserDialog()"
                            >
                              <i class="fa-solid fa-plus me-1"></i>{{ model.labelInfo.addLabel }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div class="row row-cols-auto g-3">
                        <table id="example" class="table table-striped table-bordered text-center">
                          <thead>
                            <tr>
                              <th>{{ model.userTableColName.alias }}</th>
                              <th>{{ model.userTableColName.email }}</th>
                              <th>{{ model.userTableColName.isAdmin }}</th>
                              <th>{{ model.userTableColName.operate }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-if="model.users.length === 0">
                              <td colspan="4">{{ model.labelInfo.noDataLabel }}</td>
                            </tr>
                            <tr v-for="ele in model.users">
                              <td>{{ ele.alias }}</td>
                              <td>{{ ele.email }}</td>
                              <td>
                                <i class="fa-solid fa-check" v-show="ele.admin"></i>
                                <i class="fa-solid fa-xmark" v-show="!ele.admin"></i>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-outline-primary btn-sm me-2"
                                  @click="() => interactor.openEditUser(ele.id)"
                                >
                                  <i class="fa-solid fa-pen-to-square me-1"></i>{{ model.labelInfo.editLabel }}
                                </button>

                                <button
                                  type="button"
                                  class="btn btn-outline-danger btn-sm me-2"
                                  @click="() => interactor.openDeleteUserDialog(ele.id)"
                                >
                                  <i class="fa-regular fa-trash-can me-1"></i>{{ model.labelInfo.deleteLabel }}
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--end row-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <!--tip-->
          <toast :show="model.searchCompanyUsersWasFailed" color="danger">
            <i class="bx bxs-message-square-x"></i>
            <span class="mb-0 text-danger" style="font-size:20px">{{ model.labelInfo.serverErrorInfo }}</span>
          </toast>

          <!--add companyUser modal-->
          <modal
            name="add companyUser"
            :show="model.dialog.openAddUserDialog"
            :title="model.dialog.addUserDialogTitle"
            :labelClose="true"
            :abortFunction="()=>interactor.closeAddCompanyUserDialog()"
          >
            <alert :show="model.dialog.showAddUserSuccessMessage" color="success" icon="fas fa-gift">
              {{ model.dialog.msgAddUserWithSuccess }}
            </alert>
            <alert :show="model.dialog.showAddUserFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
              {{ model.dialog.msgAddUserWithFailure }}
            </alert>
            <div>
              <form class="row g-3">
                <div class="col-md-12 position-relative">
                  <label for="email" class="form-label">{{ model.labelInfo.emailLabel }}</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': !!model.validAddUserFormErrors.email}"
                    id="email"
                    v-model="model.addUserFormData.email"
                  />
                  <div class="invalid-feedback" v-show="!!model.validAddUserFormErrors.email">
                    {{ model.validAddUserFormErrors.email }}
                  </div>
                </div>

                <div class="col-md-12 position-relative">
                  <label for="role" class="form-label">{{ model.labelInfo.userTypeAdmin }}</label>
                  <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="admin" v-model="model.addUserFormData.admin" />
                    <label class="form-check-label" for="admin">{{ model.labelInfo.userTypeAdminExplanation }}</label>
                  </div>
                </div>
              </form>
            </div>
            <template #footer>
              <button
                type="button"
                class="btn btn-primary"
                @click="()=>interactor.addUserToCompany(model.addUserFormData)"
              >
                {{ model.dialog.submit }}
              </button>
            </template>
          </modal>

          <!--delete company modal-->
          <modal
            name="delete company"
            :show="model.dialog.openDeleteUserDialog"
            :title="model.dialog.deleteUserDialogTitle"
            :labelClose="true"
            :abortFunction="()=>interactor.closeDeleteUserDialog()"
          >
            <alert :show="model.dialog.showDeleteUserSuccessMessage" color="success" icon="fas fa-gift">
              {{ model.dialog.msgDeleteUserWithSuccess }}
            </alert>
            <alert :show="model.dialog.showDeleteUserFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
              {{ model.dialog.msgDeleteUserWithFailure }}
            </alert>

            <div class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
              <div class="d-flex align-items-center">
                <div class="font-35 text-warning"><i class="bx bx-info-circle"></i></div>
                <div class="ms-3">
                  <h6 class="mb-0 text-warning">{{ model.dialog.deleteUserTipInfo }}</h6>
                </div>
              </div>
            </div>
            <template #footer>
              <button
                class="btn btn-primary"
                @click="() => interactor.deleteCompanyUser(model.dialog.currentDeleteCompanyUserId)"
              >
                {{ model.dialog.submit }}
              </button>
            </template>
          </modal>
        </section>
      </div>
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
