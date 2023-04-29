import {Component, Prop, Vue} from "vue-facing-decorator";
import CompanySiteUsersPresenter from "../../core/ts/interactors/companySiteUsersPresenter";
import CompanySiteUsersModel from "../../core/ts/models/companySiteUsersModel";
import CompanySiteUsersInteractor from "../../core/ts/interactors/companySiteUsersInteractor";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import NoDataComponent from "../../../common/component/noDataComponent";
import ButtonComponent from "../../../common/component/ButtonComponent";
import ShuttleBoxComponent from "../../../common/component/shuttleBox/ShuttleBoxComponent";
import TableComponent from "../../../common/component/table/tableComponent";


@Component({
  name: "CompanySiteUserComponent",
  components: {
    pagination: PaginationComponent,
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb:BreadcrumbComponent,
    NoDataComponent:NoDataComponent,
    ButtonComponent: ButtonComponent,
    ShuttleBoxComponent: ShuttleBoxComponent,
    TableComponent: TableComponent,
  },
  template:`

    <ShuttleBoxComponent ref="shuttleBox"
                         :leftItems="model.items"
                         left-title="All Items"
                         right-title="Selected Items">
    <button type="button" class="btn btn-outline-primary" @click="interactor.getSelectedItems(this.$refs.shuttleBox.selectedItems)">submit</button>
    </ShuttleBoxComponent>

    <TableComponent
      :columns="model.columns"
      :data="model.items"
      :totalCount="model.items.length"
      :page-sizes="5"
      :page-items="[5,10,20]"
      @changePage="(pageNo,pageSize)=>interactor.changePageForTable(pageNo,pageSize)"
      @sort="(field,sortType)=>interactor.sort(field,sortType)"
      :back-end="false"
      sorted-order="asc"
      sorted-fields="[name,age,email]">
    <template v-slot:operate="{row}">
      <ButtonComponent btn-style="width:30px" shape="btn-outline-secondary" icon="fa-solid fa-repeat fa-rotate-90">{{row.name}}</ButtonComponent>
    </template>
    </TableComponent>
    
    <div class="container company-site-users">
    
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
              <div class="ms-auto mt-3" v-show="false">
                <ButtonComponent btn-style="width:30px" shape="btn-outline-secondary" icon="fa-solid fa-repeat fa-rotate-90"  @click="interactor.showSearch(model)"></ButtonComponent>
              </div>
            </div>

            <div class="main row gy-2">
              <!--search-->
              <div class="col col-lg-12 mx-auto" v-show="model.showSearch">
                <div class="card">
                  <div class="card-body">
                    <div class="card-title">
                      <form class="row g-3">
                        <div class="col-md-3 ">
                          <!--searchForm-->
                        </div>
                      </form>
                    </div>
                    <hr/>
                    <div class="row row-cols-auto g-2" style="float:right;">
                      <div class="col">
                        <ButtonComponent btn-style="width:30px" icon="fa-solid fa-magnifying-glass" ></ButtonComponent>
                      </div>
                      <div class="col">
                        <ButtonComponent btn-style="width:30px" icon="fa-solid fa-arrows-rotate" shape="btn-outline-info"></ButtonComponent>
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
                  <div class="card-body">
                    <div class="card-title">
                      <div class="row row-cols-auto g-2">
                        <div class="col">
                          <ButtonComponent icon="a-solid fa-plus" btn-style="width:30px" @click="() => interactor.openAddUserDialog()"></ButtonComponent>
                        </div>
                      </div>
                    </div>
                    <hr/>
                    <NoDataComponent v-show="model.pageResultForUsers.total<=0" img="./img/no-data-available.gif"></NoDataComponent>
                    <div class="row row-cols-auto g-3" style="min-height:300px" v-show="model.pageResultForUsers.total>0">
                      <div class="table-responsive d-flex flex-column" style="width:100%;" >
                        <!--table-->
                        <table id="example" class="table table-striped table-bordered text-center" style="width:100%">
                          <thead>
                          <tr>
                            <th>{{ model.userTableColName.alias }}</th>
                            <th>{{ model.userTableColName.email }}</th>
                            <th>{{ model.userTableColName.role }}</th>
                            <th style="width:200px">{{ model.userTableColName.operate }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="ele in model.pageResultForUsers.data">
                            <td>{{ele.alias}}</td>
                            <td>{{ele.email}}</td>
                            <td>{{ele.role}}</td>
                            <td>
                              <ButtonComponent shape="btn-outline-danger" icon="fa-solid fa-trash-can" btn-style="width:30px" @click="() => interactor.openDeleteUserDialog(ele.id)"></ButtonComponent>
                            </td>
                          </tr>
                          </tbody>
                        </table>

                        <!--pagination-->
                        <div class="mt-auto">
                          <div  class="row float-end me-1" >
                            <div class="col ps-0 pe-1" >
                              <select class="form-select" aria-label="Default select example" v-model="model.pageInfo.pageSize" @click="()=>interactor.changePageSize(model)">
                                <option v-for="item in model.pageInfo.pageItems" :value=item>{{ item }}</option>
                              </select>
                            </div>
                            <div class="col ps-0 pe-0">
                              <pagination
                                :totalSize="model.pageResultForUsers.total"
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
          </div>
        </div>
      </section>

      <section>
        <!--tip-->
        <toast :show="model.searchCompanySiteUsersWasFailed">
          <div class="toast-body">
            <div class="d-flex align-items-center">
              <div class="font-35 text-danger"><i class="bx bxs-message-square-x"></i>
              </div>
              <div class="ms-3">
                <span class="mb-0 text-danger" style="font-size:20px">{{ model.labelInfo.serverErrorInfo }}</span>
              </div>
            </div>
          </div>
        </toast>

        <!--add companySiteUser modal-->
        <modal name="add companySiteUser"
               :show="model.dialog.openAddUserDialog"
               :title="model.dialog.addUserDialogTitle"
               :labelClose="true"
               :abortFunction="()=>interactor.closeAddCompanySiteUserDialog()">

          <alert :show="model.dialog.showAddUserSuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgAddUserWithSuccess }}
          </alert>
          <alert :show="model.dialog.showAddUserFailureMessage" color="danger"
                 icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgAddUserWithFailure }}
          </alert>
          <div>
            <form class="row g-3">
              <div class="col-md-12 position-relative">
<!--                <label for="alias" class="form-label">Alias</label>-->
<!--                <input type="text" class="form-control" :class="{'is-invalid': !!model.validAddUserFormErrors.alias}"-->
<!--                       id="alias" v-model="model.addUserFormData.alias">-->
<!--                <div class="invalid-feedback" v-show="!!model.validAddUserFormErrors.alias">-->
<!--                  {{ model.validAddUserFormErrors.alias }}-->
<!--                </div> -->
                
                <label for="email" class="form-label">{{ model.labelInfo.emailLabel }}</label>
                <input type="text" class="form-control" :class="{'is-invalid': !!model.validAddUserFormErrors.email}"
                       id="email" v-model="model.addUserFormData.email">
                <div class="invalid-feedback" v-show="!!model.validAddUserFormErrors.email">
                  {{ model.validAddUserFormErrors.email }}
                </div>
              </div>
              
              <div class="col-md-12 position-relative">
                <label for="role" class="form-label">{{ model.labelInfo.roleLabel }}</label>
                <select class="form-select" id="type" v-model="model.addUserFormData.role" :class="{'is-invalid':!!model.validAddUserFormErrors.role}">
                  <option value="ADMINISTRATOR">{{ model.labelInfo.ADMINISTRATOR }}</option>
                  <option value="USER">{{ model.labelInfo.USER }}</option>
                </select>
                <div class="invalid-feedback" v-show="!!model.validAddUserFormErrors.role">
                  {{ model.validAddUserFormErrors.role }}
                </div>
              </div>
            </form>
          </div>
          <template #footer>
            <button type="button" class="btn btn-primary" @click='()=>interactor.addCompanySiteUser(model)'>
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

        <!--delete company modal-->
        <modal name="delete companySite"
               :show="model.dialog.openDeleteUserDialog"
               :title="model.dialog.deleteUserDialogTitle"
               :labelClose="true"
               :abortFunction="()=>interactor.closeDeleteUserDialog()">

          <alert :show="model.dialog.showDeleteUserSuccessMessage" color="success" icon="fas fa-gift">
            {{ model.dialog.msgDeleteUserWithSuccess }}
          </alert>
          <alert :show="model.dialog.showDeleteUserFailureMessage" color="danger"
                 icon="fas fa-triangle-exclamation">
            {{ model.dialog.msgDeleteUserWithFailure }}
          </alert>

          <div
            class="alert border-0 border-start border-5 border-warning alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
              <div class="font-35 text-warning"><i class="bx bx-info-circle"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0 text-warning">{{ model.dialog.deleteUserTipInfo }}</h6>
              </div>
            </div>
          </div>
          <template #footer>
            <button class="btn btn-primary" @click='() => interactor.deleteCompanySiteUser(model.dialog.currentDeleteCompanySiteUserId)'>
              {{ model.dialog.submit }}
            </button>
          </template>
        </modal>

      </section>
    </div>
    
    </div>
  `
})
export default class CompanySiteUsersComponent extends Vue implements CompanySiteUsersPresenter {

  private model: CompanySiteUsersModel = new CompanySiteUsersModel();

  @Prop
  private readonly interactor!: CompanySiteUsersInteractor;

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: CompanySiteUsersModel): void {
    this.model = model;
  }
}
