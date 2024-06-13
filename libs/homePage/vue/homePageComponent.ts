import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import HomePageInteractor from "../core/ts/interactors/homePageInteractor";
import HomePagePresenter from "../core/ts/interactors/homePagePresenter";
import HomePageModel from "../core/ts/models/homePageModel";

@Component({
  name: "HomePageComponent",
  components: {
    pagination: PaginationComponent,
    modal: ModalComponent,
    toast: ToastComponent,
    breadcrumb: BreadcrumbComponent,
  },
  template: `
    <div class="container mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1>{{ model.labels.homePageTitle }}</h1>
      <div class="row g-2 row-cols-1 row-cols-sm-2 row-cols-md-3">
        <div class="col">
          <div class="card" v-show="model.showCompaniesMenue">
            <div class="card-body">
              <h5 class="card-title">{{ model.labels.company }}</h5>
              <p class="card-text">
                {{ model.labels.companyTip }}
              </p>
              <a :href="interactor.getHref('companies')" class="btn btn-primary w-100">{{ model.labels.edit }}</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ model.labels.user }}</h5>
              <p class="card-text">
                {{ model.labels.userTip }}
              </p>
              <a :href="interactor.getHref('users')" class="btn btn-primary w-100">{{ model.labels.edit }}</a>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ model.labels.roles }}</h5>
              <p class="card-text">
                {{ model.labels.rolesTip }}
              </p>
              <a :href="interactor.getHref('roles')" class="btn btn-primary w-100">{{ model.labels.edit }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class HomePageComponent extends Vue implements HomePagePresenter {
  @Prop({ required: true })
  private readonly interactor!: HomePageInteractor;
  private model: HomePageModel = new HomePageModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: HomePageModel): void {
    this.model = model;
  }
}
