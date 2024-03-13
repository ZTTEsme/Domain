import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue, Watch } from "vue-facing-decorator";
import ButtonComponent from "../../../common/component/ButtonComponent";
import NoDataComponent from "../../../common/component/noDataComponent";
import CompanyInteractor from "../../core/ts/interactors/companyInteractor";
import CompanyPresenter from "../../core/ts/interactors/companyPresenter";
import CompanyModel from "../../core/ts/models/companyModel";

@Component({
  name: "CompanyComponent",
  components: {
    pagination: PaginationComponent,
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb: BreadcrumbComponent,
    NoDataComponent: NoDataComponent,
    ButtonComponent: ButtonComponent,
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

              <div class="main row gy-2">
                <!--search-->
                <div class="col-sm-12 col-md-12 col-lg-12 mx-auto" v-show="model.showSearch">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <form class="row g-3">
                          <div class="col-md-3">
                            <label for="agentCompanyId" class="form-label">{{
                              model.labelInfo.agentCompanyLabel
                            }}</label>
                            <select
                              class="form-select"
                              id="agentCompanyId"
                              v-model.number="model.searchForm.companyId"
                              @change="interactor.changeCompany(model.searchForm.companyId)"
                            >
                              <option selected value="undefined">{{ model.labelInfo.chooseAllLabel }}</option>
                              <option
                                v-for="company in model.allCompanies"
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
                    <div class="spinner-grow text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-secondary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-success" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-danger" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-warning" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-info" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-light" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div v-show="!model.isLoading" class="card">
                    <div class="card-body">
                      <div class="card-title">
                        <div class="row row-cols-auto g-2">
                          <div class="col">
                            <ButtonComponent
                              icon="a-solid fa-plus"
                              btn-style="width:30px"
                              @click="() => interactor.openAddCompanyDialog()"
                            ></ButtonComponent>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <NoDataComponent v-show="model.pageResultForCompany.total<=0" img="./img/no-data-available.gif">
                        <span>{{ model.labelInfo.noDataLabel }}</span>
                      </NoDataComponent>
                      <div
                        class="row row-cols-auto g-3"
                        style="min-height:300px"
                        v-show="model.pageResultForCompany.total>0"
                      >
                        <div class="table-responsive d-flex flex-column" style="width:100%;">
                          <!--table-->
                          <table id="example" class="table table-striped table-bordered text-center" style="width:100%">
                            <thead>
                              <tr>
                                <th>{{ model.companyTableColName.alias }}</th>
                                <th>{{ model.companyTableColName.type }}</th>
                                <th>{{ model.companyTableColName.parentCompanyId }}</th>
                                <th>{{ model.companyTableColName.agentCompanyId }}</th>
                                <th>{{ model.companyTableColName.customerId }}</th>
                                <th style="width:200px">{{ model.companyTableColName.operate }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="ele in model.pageResultForCompany.data">
                                <td>{{ ele.alias }}</td>
                                <td>{{ ele.type }}</td>
                                <td>{{ ele.parentCompanyName }}</td>
                                <td>{{ ele.agentCompanyName }}</td>
                                <td>{{ ele.customerId }}</td>
                                <td>
                                  <ButtonComponent
                                    icon="fa-solid fa-pen-to-square"
                                    btn-style="width:30px"
                                    @click="() => interactor.openModifyDialog(
                                             ele.id,
                                             ele.agentCompanyId,
                                             ele.alias,
                                             ele.type,
                                             ele.customerId)"
                                  ></ButtonComponent>
                                  <ButtonComponent
                                    btn-style="margin-left:10px;width:30px"
                                    shape="btn-outline-danger"
                                    icon="fa-solid fa-trash-can"
                                    @click="() => interactor.openDeleteDialog(ele.id)"
                                  ></ButtonComponent>

                                  <ButtonComponent
                                    btn-style="width:30px;height:30px;margin-left:10px"
                                    shape="btn-outline-success"
                                    icon="fa-solid fa-right-to-bracket"
                                    @click="()=>interactor.goCompany(ele.id)"
                                  >
                                  </ButtonComponent>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <!--pagination-->
                          <div class="mt-auto">
                            <div class="row float-end me-1">
                              <div class="col ps-0 pe-1">
                                <select
                                  class="form-select"
                                  aria-label="Default select example"
                                  v-model="model.pageInfo.pageSize"
                                  @click="()=>interactor.changePageSize(model)"
                                >
                                  <option v-for="item in model.pageInfo.pageItems" :value="item">{{ item }}</option>
                                </select>
                              </div>
                              <div class="col ps-0 pe-0">
                                <pagination
                                  :totalSize="model.pageResultForCompany.total"
                                  :pageSize="model.pageInfo.pageSize"
                                  v-model="model.pageInfo.pageNo"
                                  @change="(pageNo)=>interactor.changePage(pageNo)"
                                ></pagination>
                              </div>
                            </div>
                          </div>
                        </div>
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

        <section>
          <!--tip-->
          <toast :show="model.searchCompaniesWasFailed" :delay="1000">
            <div class="toast-body">
              <div class="d-flex align-items-center">
                <div class="font-35 text-danger"><i class="bx bxs-message-square-x"></i></div>
                <div class="ms-3">
                  <span class="mb-0 text-danger" style="font-size:20px">{{ model.labelInfo.serverErrorInfo }}</span>
                </div>
              </div>
            </div>
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
                    <option value="CUSTOMER">{{ model.labelInfo.CUSTOMER }}</option>
                    <option value="MANUFACTURER">{{ model.labelInfo.MANUFACTURER }}</option>
                    <option value="TRADER">{{ model.labelInfo.TRADER }}</option>
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
                      v-for="company in model.allCompanies"
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
                      v-for="company in model.allCompanies"
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
                                        model,
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
            <alert
              :show="model.dialog.showDeleteCompanyFailureMessage"
              color="danger"
              icon="fas fa-triangle-exclamation"
            >
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
            <alert
              :show="model.dialog.showModifyCompanyFailureMessage"
              color="danger"
              icon="fas fa-triangle-exclamation"
            >
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
                  <option value="CUSTOMER">{{ model.labelInfo.CUSTOMER }}</option>
                  <option value="MANUFACTURER">{{ model.labelInfo.MANUFACTURER }}</option>
                  <option value="TRADER">{{ model.labelInfo.TRADER }}</option>
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
                    v-for="company in model.allCompanies"
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
                    v-for="company in model.allCompanies"
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
                          model,
                         "MODIFY_COMPANY"
                         )'
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
export default class CompanyComponent extends Vue implements CompanyPresenter {
  // 页面JS
  @Prop
  public readonly interactor!: CompanyInteractor;

  // 数据原型
  public model: CompanyModel = new CompanyModel();

  public key: number | undefined = this.model.searchForm.agentCompanyId;

  // 当前分页大小
  public readonly pageNo: number = this.model.pageInfo.pageNo;

  @Watch("pageNo", { deep: true, immediate: true })
  public propertyWatcher(newValue: string, oldValue: string): void {
    if (newValue !== oldValue) {
      this.interactor.changePageSize(this.model);
    }
  }

  @Watch("key", { deep: true, immediate: true })
  public propertyWatcherOne(newValue: string, oldValue: string): void {
    console.log(newValue);
    console.log(oldValue);
  }

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: CompanyModel): void {
    this.model = model;
  }
}
