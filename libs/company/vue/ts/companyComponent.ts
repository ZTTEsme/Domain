import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import CompanyInteractor from "../../core/ts/interactors/companyInteractor";
import CompanyPresenter from "../../core/ts/interactors/companyPresenter";
import CompanyViewModel from "../../core/ts/models/companyViewModel";

@Component({
  name: "CompanyComponent",
  components: {
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb: BreadcrumbComponent,
  },
  template: `
    <div class="container company">
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
                </div>
              </div>

              <div>
                <h1>{{ model.labelInfo.title }}</h1>
              </div>

              <div class="main row gy-2">
                <!--search-->
                <div class="col-sm-12 col-md-12 col-lg-12 mx-auto" v-show="model.showSearch">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <form class="row g-3">
                          <div class="col-md-12">
                            <label for="agentCompanyId" class="form-label">{{
                              model.labelInfo.agentCompanyLabel
                            }}</label>
                            <select
                              class="form-select"
                              id="agentCompanyId"
                              v-model="model.filterAgentId"
                              @change="interactor.setCompanyFilter(model.filterAgentId)"
                            >
                              <option selected :value="undefined">{{ model.labelInfo.chooseAllLabel }}</option>
                              <option
                                v-for="company in model.companiesNotFiltered"
                                :key="company.id"
                                :label="company.alias"
                                :value="company.id"
                              />
                            </select>
                          </div>
                        </form>
                      </div>
                      <!--end row-->
                    </div>
                  </div>
                </div>
                <!--table-->
                <div class="col-sm-12 col-md-12 col-lg-12 mx-auto">
                  <div v-show="model.isLoading" style="position: absolute;left: 43%;top: 60%;z-index: 100;">
                    <div class="spinner-grow text-primary" role="status" colspan="6">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div v-show="!model.isLoading" class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <div class="row row-cols-auto g-2">
                          <div class="col">
                            <button
                              type="button"
                              class="btn btn-outline-success btn-sm me-2"
                              @click="() => interactor.openAddCompanyDialog()"
                            >
                              <i class="fa-solid fa-plus me-1"></i>{{ model.labelInfo.addLabel }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div class="row row-cols-auto g-3">
                        <table class="table table-striped text-center">
                          <thead>
                            <tr>
                              <th>{{ model.companyTableColName.alias }}</th>
                              <th>{{ model.companyTableColName.type }}</th>
                              <th>{{ model.companyTableColName.parentCompanyId }}</th>
                              <th>{{ model.companyTableColName.agentCompanyId }}</th>
                              <th>{{ model.companyTableColName.customerId }}</th>
                              <th>{{ model.companyTableColName.operate }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-if="model.companiesFiltered.length === 0">
                              <td colspan="6">{{ model.labelInfo.noDataLabel }}</td>
                            </tr>
                            <tr v-for="company in model.companiesFiltered">
                              <td>{{ company.alias }}</td>
                              <td>{{ company.type }}</td>
                              <td>{{ company.parentCompanyName }}</td>
                              <td>{{ company.agentCompanyName }}</td>
                              <td>{{ company.customerId }}</td>
                              <td>
                                <button
                                  type="button"
                                  class="btn btn-outline-primary btn-sm me-2"
                                  @click="() => interactor.openModifyDialog(company.id)"
                                >
                                  <i class="fa-regular fa-pen-to-square me-1"></i>{{ model.labelInfo.editLabel }}
                                </button>

                                <button
                                  type="button"
                                  class="btn btn-outline-danger btn-sm me-2"
                                  @click="() => interactor.openDeleteDialog(company.id)"
                                >
                                  <i class="fa-regular fa-trash-can me-1"></i>{{ model.labelInfo.deleteLabel }}
                                </button>

                                <button
                                  type="button"
                                  class="btn btn-outline-success btn-sm me-2"
                                  @click="() => interactor.goCompany(company.id)"
                                >
                                  <i class="fa-solid fa-right-to-bracket  me-1"></i>{{ model.labelInfo.detailsLabel }}
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
              <!--end row-->
            </div>
          </div>
        </section>

        <!--tip-->
        <toast :show="model.searchCompaniesWasFailed" color="danger">
          <i class="fa-solid fa-xmark me-1"></i>
          <span>{{ model.labelInfo.serverErrorInfo }}</span>
        </toast>

        <!--add company modal-->
        <modal
          name="add company"
          :show="model.dialog.openAddCompanyDialog"
          :title="model.dialog.addCompany"
          :labelClose="true"
          :abortFunction="()=>interactor.closeAddCompanyDialog()"
        >
          <alert :show="model.dialog.showAddCompanySuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgAddCompanyWithSuccess }}
          </alert>
          <alert :show="model.dialog.showAddCompanyFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgAddCompanyWithFailure }}
          </alert>
          <div>
            <form class="row g-3">
              <div class="col-md-12 position-relative">
                <label for="alias" class="form-label">{{ model.labelInfo.aliasLabel }}</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{'is-invalid':!!model.formErrors.alias}"
                  id="alias"
                  v-model="model.formData.alias"
                />
                <div class="invalid-feedback" v-show="!!model.formErrors.alias">{{ model.formErrors.alias }}</div>
              </div>
              <div class="col-md-12 position-relative">
                <label for="type" class="form-label">{{ model.labelInfo.typeLabel }}</label>
                <select
                  class="form-select"
                  id="type"
                  v-model="model.formData.type"
                  :class="{'is-invalid':!!model.formErrors.type}"
                >
                  <option value="CUSTOMER">{{ model.labelInfo.customer }}</option>
                  <option value="MANUFACTURER">{{ model.labelInfo.manufacturer }}</option>
                  <option value="TRADER">{{ model.labelInfo.trader }}</option>
                  <option value="SUBSIDIARY">{{ model.labelInfo.subsidiary }}</option>
                </select>
                <div class="invalid-feedback" v-show="!!model.formErrors.type">{{ model.formErrors.type }}</div>
              </div>

              <div class="col-md-12 position-relative">
                <label for="type" class="form-label">{{ model.labelInfo.parentCompanyLabel }}</label>
                <select
                  class="form-select"
                  id="type"
                  v-model.number="model.formData.parentCompanyId"
                  :class="{'is-invalid':!!model.formErrors.parentCompanyId}"
                >
                  <option label="N/A" :value="null"></option>
                  <option
                    v-for="company in model.companiesNotFiltered"
                    :key="company.id"
                    :label="company.alias"
                    :value="company.id"
                  />
                </select>
                <div class="invalid-feedback" v-show="!!model.formErrors.parentCompanyId">
                  {{ model.formErrors.parentCompanyId }}
                </div>
              </div>

              <div class="col-md-12 position-relative">
                <label for="type" class="form-label">{{ model.labelInfo.agentCompanyNameLabel }}</label>
                <select
                  class="form-select"
                  id="type"
                  v-model.number="model.formData.agentCompanyId"
                  :class="{'is-invalid':!!model.formErrors.agentCompanyId}"
                >
                  <option label="N/A" :value="null"></option>
                  <option
                    v-for="company in model.companiesNotFiltered"
                    :key="company.id"
                    :label="company.alias"
                    :value="company.id"
                  />
                </select>
                <div class="invalid-feedback" v-show="!!model.formErrors.agentCompanyId">
                  {{ model.formErrors.agentCompanyId }}
                </div>
              </div>

              <div class="col-md-12 position-relative">
                <label for="customerId" class="form-label">{{ model.labelInfo.customerIdLabel }}</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{'is-invalid':!!model.formErrors.customerId}"
                  id="customerId"
                  v-model="model.formData.customerId"
                />
                <div class="invalid-feedback" v-show="!!model.formErrors.customerId">
                  {{ model.formErrors.customerId }}
                </div>
              </div>
            </form>
          </div>
          <template #footer>
            <button
              type="button"
              class="btn btn-primary"
              @click='()=>interactor.saveCompany(
                                        model.formData,
                                        "ADD_COMPANY"
                                        )'
            >
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

        <!--delete company modal-->
        <modal
          name="delete company"
          :show="model.dialog.openDeleteDialog"
          :title="model.dialog.deleteCompany"
          :labelClose="true"
          :abortFunction="()=>interactor.closeDeleteDialog()"
        >
          <alert :show="model.dialog.showDeleteCompanySuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgDeleteCompanyWithSuccess }}
          </alert>
          <alert :show="model.dialog.showDeleteCompanyFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgDeleteCompanyWithFailure }}
          </alert>

          <div class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
              <div class="font-35 text-warning"><i class="bx bx-info-circle"></i></div>
              <div class="ms-3">
                <h6 class="mb-0 text-warning">{{ model.dialog.deleteTipInfo }}</h6>
              </div>
            </div>
          </div>
          <template #footer>
            <button
              class="btn btn-primary"
              @click="() => interactor.deleteCompany(model.dialog.currentDeleteCompanyId)"
            >
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

        <!--modify company modal-->
        <modal
          name="modify company"
          :show="model.dialog.openModifyCompanyDialog"
          :title="model.dialog.modifyCompanyTitle"
          :labelClose="true"
          :abortFunction="()=>interactor.closeModifyDialog()"
        >
          <alert :show="model.dialog.showModifyCompanySuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgModifyCompanyWithSuccess }}
          </alert>
          <alert :show="model.dialog.showModifyCompanyFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgModifyCompanyWithFailure }}
          </alert>

          <form class="row g-3">
            <div class="col-md-12 position-relative">
              <label for="alias" class="form-label">{{ model.labelInfo.aliasLabel }}</label>
              <input
                type="text"
                class="form-control"
                id="alias"
                :class="{'is-invalid':!!model.formErrors.alias}"
                v-model="model.formData.alias"
              />
              <div class="invalid-feedback" v-show="!!model.formErrors.alias">{{ model.formErrors.alias }}</div>
            </div>

            <div class="col-md-12 position-relative">
              <label for="type" class="form-label">{{ model.labelInfo.typeLabel }}</label>
              <select
                class="form-select"
                id="type"
                v-model="model.formData.type"
                :class="{'is-invalid':!!model.formErrors.type}"
              >
                <option value="CUSTOMER">{{ model.labelInfo.customer }}</option>
                <option value="MANUFACTURER">{{ model.labelInfo.manufacturer }}</option>
                <option value="TRADER">{{ model.labelInfo.trader }}</option>
                <option value="SUBSIDIARY">{{ model.labelInfo.subsidiary }}</option>
              </select>
              <div class="invalid-feedback" v-show="!!model.formErrors.type">{{ model.formErrors.type }}</div>
            </div>

            <div class="col-md-12 position-relative">
              <label for="type" class="form-label">{{ model.labelInfo.parentCompanyLabel }}</label>
              <select
                class="form-select"
                id="type"
                v-model.number="model.formData.parentCompanyId"
                :class="{'is-invalid':!!model.formErrors.parentCompanyId}"
              >
                <option label="N/A" :value="null"></option>
                <option
                  v-for="company in model.companiesNotFiltered"
                  :key="company.id"
                  :label="company.alias"
                  :value="company.id"
                />
              </select>
              <div class="invalid-feedback" v-show="!!model.formErrors.parentCompanyId">
                {{ model.formErrors.parentCompanyId }}
              </div>
            </div>

            <div class="col-md-12 position-relative">
              <label for="type" class="form-label">{{ model.labelInfo.agentCompanyLabel }}</label>
              <select
                class="form-select"
                id="type"
                v-model.number="model.formData.agentCompanyId"
                :class="{'is-invalid':!!model.formErrors.agentCompanyId}"
              >
                <option label="N/A" :value="null"></option>
                <option
                  v-for="company in model.companiesNotFiltered"
                  :key="company.id"
                  :label="company.alias"
                  :value="company.id"
                />
              </select>
              <div class="invalid-feedback" v-show="!!model.formErrors.agentCompanyId">
                {{ model.formErrors.agentCompanyId }}
              </div>
            </div>

            <div class="col-md-12 position-relative">
              <label for="customerId" class="form-label">Customer ID</label>
              <input
                type="text"
                class="form-control"
                :class="{'is-invalid':!!model.formErrors.customerId}"
                id="customerId"
                v-model="model.formData.customerId"
              />
              <div class="invalid-feedback" v-show="!!model.formErrors.customerId">
                {{ model.formErrors.customerId }}
              </div>
            </div>
          </form>

          <template #footer>
            <button
              class="btn btn-primary"
              @click='() => interactor.saveCompany(
                          model.formData,
                         "MODIFY_COMPANY"
                         )'
            >
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>
      </div>
    </div>
  `,
})
export default class CompanyComponent extends Vue implements CompanyPresenter {
  @Prop
  public readonly interactor!: CompanyInteractor;

  public model: CompanyViewModel = new CompanyViewModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: CompanyViewModel): void {
    this.model = model;
  }
}
