import Router from "cloos-vue-router/lib/core/router";
import VueRouter from "cloos-vue-router/lib/vue/vueRouter";
import VueRouterOptions from "cloos-vue-router/lib/vue/vueRouterOptions";
import AppLinkComponent from "qnect-sdk-web/lib/apps/vue/ts/appLinkComponent";
import AppLinkContainerComponent from "qnect-sdk-web/lib/apps/vue/ts/appLinkContainerComponent";
import BreadcrumbComponent from "qnect-sdk-web/lib/breadcrumb/vue/ts/breadcrumbComponent";
import AlertComponent from "qnect-sdk-web/lib/common/vue/ts/alertComponent";
import CarouselComponent from "qnect-sdk-web/lib/common/vue/ts/carouselComponent";
import CarouselItemComponent from "qnect-sdk-web/lib/common/vue/ts/carouselItemComponent";
import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import PaginationComponent from "qnect-sdk-web/lib/common/vue/ts/paginationComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import Module from "qnect-sdk-web/lib/modules/core/ts/module";

export default class RouterModule implements Module {
  private router!: Router;

  public getName(): string {
    return RouterModule.name;
  }

  public getRouter(): Router {
    return this.router;
  }

  public async load(): Promise<void> {
    this.router = new VueRouter(
      new VueRouterOptions({
        renderContainerId: "main",
        bodyAttribute: "data-page",
        documentTitlePrefix: "QNECT | ",
        plugins: [],
        components: [
          ["alert", AlertComponent],
          ["app-link", AppLinkComponent],
          ["app-link-container", AppLinkContainerComponent],
          ["breadcrumb", BreadcrumbComponent],
          ["carousel-item", CarouselItemComponent],
          ["carousel", CarouselComponent],
          ["modal", ModalComponent],
          ["pagination", PaginationComponent],
          ["toast", ToastComponent],
        ],
      })
    );
  }

  public async loadSecondPhase(): Promise<void> {
    await this.router.loadRouteForCurrentPath();
  }
}
