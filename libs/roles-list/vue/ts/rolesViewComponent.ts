import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import RolesViewInteractor from "../../core/ts/interactors/rolesViewInteractor";
import RolesViewPresenter from "../../core/ts/interactors/rolesViewPresenter";
import RolesViewModel from "../../core/ts/models/rolesViewModel";

@Component({
  name: "RolesViewComponent",
  components: {
    breadcrumb: BreadcrumbComponent,
    toast: ToastComponent,
  },
  template: `
    <div class="container home-page mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1>{{ model.msgTitle }}</h1>

      <template v-if="model.showMainContent">
        <div class="row mb-5" v-show="model.showCompaniesMenue">
          <div class="col-12 col-sm-6 col-lg-5 col-xl-4">
            <label for="filter-company" class="form-label">{{ model.msgCompanies }}</label>
            <select
              class="form-select"
              id="filter-company"
              v-model="model.selectedCompanyId"
              @change="interactor.changeCompany(model.selectedCompanyId)"
            >
              <option v-for="company in model.companies" :value="company.value">{{ company.name }}</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="mb-3" v-show="model.showEditActions">
              <a class="btn btn-primary" :href="model.addNewRoleLink">
                <i class="fa-solid fa-plus"></i>
                {{ model.msgAddNewRole }}
              </a>
            </div>

            <ul class="table-list table-list--striped">
              <li class="table-list__row table-list__row--header">
                <div class="table-list__cell">{{ model.msgRole }}</div>
                <div class="table-list__cell"></div>
              </li>
              <li class="table-list__row" v-if="model.roles.length === 0">
                <div class="table-list__cell">{{ model.msgNoRolesFound }}</div>
                <div class="table-list__cell"></div>
              </li>
              <li class="table-list__row" v-for="role in model.roles">
                <div class="table-list__cell">{{ role.alias }}</div>
                <div class="table-list__cell text-md-end">
                  <a class="btn btn-outline-primary btn-sm" :href="role.editLink" v-show="model.showEditActions">
                    <i class="fa-solid fa-pen-to-square me-1"></i>
                    {{ model.msgEdit }}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <toast :show="model.showDeletedSuccessful" color="success">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgDeletedSuccessful }}</span>
      </toast>

      <toast :show="model.showGetRolesFailedMsg" color="danger">
        <i class="fa-solid fa-xmark me-1"></i>
        <span>{{ model.msgGetRolesFailed }}</span>
      </toast>
    </div>
  `,
})
export default class RolesViewComponent extends Vue implements RolesViewPresenter {
  @Prop
  private readonly interactor!: RolesViewInteractor;
  private model: RolesViewModel = new RolesViewModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: RolesViewModel): void {
    this.model = model;
  }
}
