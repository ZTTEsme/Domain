import { Component, Prop, Vue } from "vue-facing-decorator";
import HomeInteractor from "../../core/ts/homeInteractor";
import HomeModel from "../../core/ts/homeModel";
import HomePresenter from "../../core/ts/homePresenter";

@Component({
  components: {},
  template: `
    <h1 class="hidden mb-0">{{ model.msgTitle }}</h1>

    <carousel name="c1" class="mb-3 d-none d-sm-block">
      <carousel-item v-for="item in 4" orientation="start">
        <div :style="'background-color: #' + item + item + item">
          <div class="container py-2 justify-content-end d-flex" style="padding-right:10%;padding-left:10%;">
            <img src="img/ipad-dashboard2x.png" class="img-fluid" style="max-height:200px;" />
          </div>
        </div>
        <template #caption>
          <h5>{{ item }} slide label</h5>
          <p>Some representative placeholder content for the {{ item }} slide.</p>
        </template>
      </carousel-item>
    </carousel>

    <app-link-container
      :apps="model.favoriteApps"
      :showLink="model.showFavoriteLinks"
      :showNotifications="!model.showFavoritesRemoveAction"
      :showRemoveAction="model.showFavoritesRemoveAction"
      :removeAction="(identifier) => interactor.removeFavorite(identifier)"
      :disableActions="model.disableFavoriteActions"
      class="pt-4"
    >
      <!-- <header class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h2>{{ model.msgFavorites }}</h2>
        <button
          type="button"
          class="btn btn-sm btn-secondary"
          @click="() => interactor.toggleEditFavorites()"
          :disabled="model.disableFavoriteActions"
        >
          <i class="fa-lightbulb" :class="model.showFavoriteLinks ? 'fas' : 'far'"></i> {{ model.msgEditFavorites }}
        </button>
      </header> -->
    </app-link-container>

    <aside>
      <button
        class="btn btn-warning feedback-button"
        type="button"
        @click="() => interactor.openFeedbackDialog()"
        :disabled="model.disableFeedback"
      >
        {{ model.msgFeedback }}
      </button>
      <modal
        name="feedback"
        :show="model.showFeedbackDialog"
        :title="model.msgFeedback"
        :abortFunction="() => interactor.closeFeedbackDialog()"
      >
        <alert :show="model.showFeedbackSuccessMessage" color="success" icon="fas fa-gift">
          {{ model.msgSendFeedbackWithSuccess }}
        </alert>
        <alert :show="model.showFeedbackFailureMessage" color="danger" icon="fas fa-triangle-exclamation">
          {{ model.msgSendFeedbackWithFailure }}
        </alert>

        <form>
          <label for="input-feedback" class="form-label">{{ model.msgFeedbackLabel }}</label>
          <textarea
            class="form-control"
            id="input-feedback"
            rows="4"
            v-model="model.inputFeedback"
            :disabled="model.disableFeedback"
          ></textarea>
        </form>

        <template #footer>
          <button
            class="btn btn-primary"
            @click="() => interactor.sendFeedback(model.inputFeedback)"
            :disabled="model.disableFeedback"
          >
            {{ model.msgSendFeedback }}
          </button>
        </template>
      </modal>
    </aside>
  `,
})
export default class HomeController extends Vue implements HomePresenter {
  @Prop
  private readonly interactor!: HomeInteractor;
  private model: HomeModel = new HomeModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: HomeModel): void {
    this.model = model;
  }
}
