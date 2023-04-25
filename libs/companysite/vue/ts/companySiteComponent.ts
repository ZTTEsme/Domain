import { Component, Prop, Vue } from "vue-facing-decorator";
import CompanySiteInteractor from "../../core/ts/interactors/companySiteInteractor";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import CompanySitePresenter from "../../core/ts/interactors/companySitePresenter";
import CompanySiteModel from "../../core/ts/models/companySiteModel";
import NoDataComponent from "../../../common/component/noDataComponent";
import ButtonComponent from "../../../common/component/ButtonComponent";

@Component({
  name: "CompanySiteComponent",
  components: {
    pagination: PaginationComponent,
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb:BreadcrumbComponent,
    NoDataComponent:NoDataComponent,
    ButtonComponent: ButtonComponent
  },
  template: `
    <div class="container company-site">
    <div class="wrapper">
      <!--content -->
      <section>
        <div class="page-wrapper">
          <div class="page-content">
            <!--breadcrumb-->
            <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-1">
              <div style="margin-top: 15px;">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb mb-0 p-0">
                    <li class="breadcrumb-item">
                      <img src="./img/home.gif" style="width:40px">
                    </li>
                    <!--<li class="ps-1" class="breadcrumb-title">{{model.moduleName}}</li>-->
                    <li class="ps-1 pt-2">
                      <breadcrumb :items="model.breadcrumb" />
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="ms-auto">
                <ButtonComponent btn-style="width:30px" icon="fa-solid fa-repeat fa-rotate-90"  @click="interactor.showSearch(model)"></ButtonComponent>
              </div>
            </div>

            <div class="main row gy-2">
              <!--search-->
              <div class="col col-lg-12 mx-auto" v-show="model.showSearch">
                <div class="card">
                  <div class="card-body pt-1 pb-1">
                    <div class="card-title">
                      <form class="row g-3">
                        <div class="col-md-4 ">
                          <label for="companyId" class="form-label">{{ model.labelInfo.companyId }}</label>
                          <select class="form-select" id="companyId" v-model="model.searchForm.companyId">
                            <option
                              v-for="company in model.companiesForSelect"
                              :key="company.id"
                              :label="company.alias"
                              :value="company.id"
                            />
                          </select>
                        </div>
                      </form>
                    </div>
                    <hr class="m-1"/>
                    <div class="row row-cols-auto g-2" style="float:right;">
                      <div class="col">
                        <ButtonComponent btn-style="width:30px" icon="fa-solid fa-magnifying-glass" @click="interactor.getCompanySites(model.searchForm.companyId)"></ButtonComponent>
                      </div>
                      <div class="col">
                        <ButtonComponent btn-style="width:30px" icon="fa-solid fa-arrows-rotate" @click="interactor.resetSearchForm(model)"></ButtonComponent>
                      </div>

                    </div>
                    <!--end row-->
                  </div>
                </div>
              </div>
              <!--table-->
              <div class="col col-lg-12 mx-auto">
                <div v-show="model.isLoading" style="position: absolute;left: 43%;top: 60%;z-index: 100;">
                  <div class="spinner-grow text-primary" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-secondary" role="status"><span class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-success" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-danger" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-warning" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-info" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                  <div class="spinner-grow text-light" role="status"><span
                    class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-show="!model.isLoading" class="card">
                  <div class="card-body d-flex flex-column">
                    <div class="card-title">
                      <div class="row row-cols-auto g-2">
                        <div class="col">
                          <ButtonComponent icon="a-solid fa-plus" btn-style="width:30px" @click="() => interactor.openAddCompanySiteDialog()"></ButtonComponent>
                        </div>
                      </div>
                    </div>
                    
                    <hr/>

                    <NoDataComponent v-show="model.pageResultForCompanySite.total<=0" img="./img/no-data-available.gif"></NoDataComponent>

                    <!--卡片列表-->
                    <div class="row row-cols-auto g-1" style="min-height:300px"
                         v-show="model.pageResultForCompanySite.total>0">
                      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 company-site-card" style="width:100%">
                        <div class="col" v-for="ele in model.pageResultForCompanySite.data">
                          <div class="card radius-10 border-start border-0 border-3 border-info">
                            <div class="card-body">
                              <div class="d-flex align-items-center">
                                <div>
                                  <p class="mb-0 text-secondary">
                                    <i class="fa-solid fa-land-mine-on fa-beat-fade fa-xs" style="color: #023e64;"></i>
                                    {{ model.companySiteTableColName.alias }}
                                  </p>
                                  <h6 class="my-1 text-info">{{ ele.alias }}</h6>
                                  <p class="mb-0 font-13 mt-3">

                                    <ButtonComponent icon="fa-solid fa-pen-to-square" btn-style="width:30px" @click="() => interactor.openModifyDialog(
                                             ele.alias,
                                             ele.id,
                                             ele.companyId)"></ButtonComponent>
                                    <ButtonComponent btn-style="margin-left:10px;width:30px" icon="fa-solid fa-trash-can" @click="() => interactor.openDeleteDialog(ele.id)"></ButtonComponent>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--pagination-->
                    <div class="mt-auto">
                      <div class="row float-end m-1"  v-show="model.pageResultForCompanySite.total>0">
                        <div class="col pe-0 ps-1" >
                          <select class="form-select" aria-label="Default select example"
                                  v-model="model.pageInfo.pageSize" @click="()=>interactor.changePageSize(model)">
                            <option v-for="item in model.pageInfo.pageItems" :value=item>{{ item }}</option>
                          </select>
                        </div>
                        <div class="col pe-0 ps-1">
                          <pagination
                            :totalSize="model.pageResultForCompanySite.total"
                            :pageSize="model.pageInfo.pageSize"
                            v-model="model.pageInfo.pageNo"
                            @change="(pageNo)=>interactor.changePage(pageNo)"
                          ></pagination>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <!--tip-->
        <toast :show="model.searchCompanySiteWasFailed">
          <div class="toast-body">
            <div class="d-flex align-items-center">
              <div class="font-35 text-danger"><i class="bx bxs-message-square-x"></i>
              </div>
              <div class="ms-3">
                <span class="mb-0 text-danger" style="font-size:20px">Server Internal Error!!!</span>
              </div>
            </div>
          </div>
        </toast>

        <!--add companySite modal-->
        <modal name="add companySite"
               :show="model.dialog.openAddCompanySiteDialog"
               :title="model.dialog.addCompanySite"
               :labelClose="true"
               :abortFunction="()=>interactor.closeAddCompanySiteDialog()">

          <alert :show="model.dialog.showAddCompanySiteSuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgAddCompanySiteWithSuccess }}
          </alert>
          <alert :show="model.dialog.showAddCompanySiteFailureMessage" color="danger"
                 icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgAddCompanySiteWithFailure }}
          </alert>
          <div>
            <form class="row g-3">
              <div class="col-md-12 position-relative">
                <label for="alias" class="form-label">Alias</label>
                <input type="text" class="form-control" :class="{'is-invalid': !!model.validAddCompanySiteFormErrors.alias}"
                       id="alias" v-model="model.addCompanySiteFormData.alias">
                <div class="invalid-feedback" v-show="!!model.validAddCompanySiteFormErrors.alias">
                  {{ model.validAddCompanySiteFormErrors.alias }}
                </div>
              </div>
            </form>
          </div>
          <template #footer>
            <button type="button" class="btn btn-primary" @click='()=>interactor.addCompanySite(model)'>
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

        <!--delete company modal-->
        <modal name="delete companySite"
               :show="model.dialog.openDeleteDialog"
               :title="model.dialog.deleteCompanySiteTitle"
               :labelClose="true"
               :abortFunction="()=>interactor.closeDeleteDialog()">

          <alert :show="model.dialog.showDeleteCompanySiteSuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgDeleteCompanySiteWithSuccess }}
          </alert>
          <alert :show="model.dialog.showDeleteCompanySiteFailureMessage" color="danger"
                 icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgDeleteCompanySiteWithFailure }}
          </alert>

          <div
            class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
              <div class="font-35 text-warning"><i class="bx bx-info-circle"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-warning">{{ model.dialog.deleteTipInfo }}</h6>
              </div>
            </div>
          </div>
          <template #footer>
            <button
              class="btn btn-primary"
              @click='() => interactor.deleteCompanySite(model.dialog.currentDeleteCompanySiteId)'
            >
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

        <!--modify company modal-->
        <modal name="modify companySite"
               :show="model.dialog.openModifyCompanySiteDialog"
               :title="model.dialog.modifyCompanySiteTitle"
               :labelClose="true"
               :abortFunction="()=>interactor.closeModifyDialog()">

          <alert :show="model.dialog.showModifyCompanySiteSuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgModifyCompanySiteWithSuccess }}
          </alert>
          <alert :show="model.dialog.showModifyCompanySiteFailureMessage" color="danger"
                 icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgModifyCompanySiteWithFailure }}
          </alert>

          <form class="row g-3">
            <div class="col-md-12 position-relative">
              <label for="companySiteId" class="form-label">Company Alias Name</label>
              <select class="form-select" :class="{'is-invalid':!!model.validModifyCompanySiteFormErrors.companyId}"
                      id="companySiteId" v-model="model.modifyCompanySiteFormData.companyId">
                <option
                  v-for="company in model.companiesForSelect"
                  :key="company.id"
                  :label="company.alias"
                  :value="company.id"
                />
              </select>
              <div class="invalid-feedback" v-show="!!model.validModifyCompanySiteFormErrors.companyId">
                {{ model.validModifyCompanySiteFormErrors.companyId }}
              </div>
            </div>

            <div class="col-md-12 position-relative">
              <label for="alias" class="form-label">Company Site Alias Name</label>
              <input type="text" class="form-control"
                     :class="{'is-invalid': !!model.validModifyCompanySiteFormErrors.alias}" id="alias"
                     v-model="model.modifyCompanySiteFormData.alias">
              <div class="invalid-feedback" v-show="!!model.validModifyCompanySiteFormErrors.alias">
                {{ model.validModifyCompanySiteFormErrors.alias }}
              </div>
            </div>
          </form>

          <template #footer>
            <button
              class="btn btn-primary"
              @click='() => interactor.modifyCompanySite(model)'
            >{{ model.dialog.submit }}
            </button>
          </template>
        </modal>
      </section>
    </div>
    </div>
`,
})
export default class CompanySiteComponent extends Vue implements CompanySitePresenter {

  private model: CompanySiteModel = new CompanySiteModel();

  @Prop
  private readonly interactor!: CompanySiteInteractor;

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: CompanySiteModel): void {
    this.model = model;
  }
}
