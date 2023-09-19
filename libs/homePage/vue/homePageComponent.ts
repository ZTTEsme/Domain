import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import ButtonComponent from "../../common/component/ButtonComponent";
import NoDataComponent from "../../common/component/noDataComponent";
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
    NoDataComponent: NoDataComponent,
    ButtonComponent: ButtonComponent,
  },
  template: `
    <div class="container home-page mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <div class="wrapper">
        <!--content-->
        <section>
          <div class="page-wrapper">
            <div class="page-content">
              <h1 class="hidden mb-3">{{ model.labels.homePageTitle }}</h1>
              <div class="row g-1 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
                <div class="card me-3">
                  <div class="card-body">
                    <h5 class="card-title">{{ model.labels.company }}</h5>
                    <p class="card-text">
                      {{ model.labels.companyTip }}
                    </p>
                    <a :href="interactor.router.getFullUriOfRouteByName('company')" class="btn btn-primary w-100">{{
                      model.labels.edit
                    }}</a>
                  </div>
                </div>
                <div class="card me-3">
                  <div class="card-body">
                    <h5 class="card-title">{{ model.labels.site }}</h5>
                    <p class="card-text">
                      {{ model.labels.siteTip }}
                    </p>
                    <a :href="interactor.router.getFullUriOfRouteByName('CompanySite')" class="btn btn-primary w-100">{{
                      model.labels.edit
                    }}</a>
                  </div>
                </div>
                <div class="card me-3">
                  <div class="card-body">
                    <h5 class="card-title">{{ model.labels.user }}</h5>
                    <p class="card-text">
                      {{ model.labels.userTip }}
                    </p>
                    <a :href="interactor.router.getFullUriOfRouteByName('User')" class="btn btn-primary w-100">{{
                      model.labels.edit
                    }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!--dialog-->
        <section></section>
      </div>
    </div>
  `,
})
export default class HomePageComponent extends Vue implements HomePagePresenter {
  @Prop
  private readonly interactor!: HomePageInteractor;

  // 数据原型
  private model: HomePageModel = new HomePageModel();
  // 页面JS

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: HomePageModel): void {
    this.model = model;
  }
}
