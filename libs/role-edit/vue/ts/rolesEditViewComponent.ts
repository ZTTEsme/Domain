import ModalComponent from "qnect-sdk-web/lib/common/vue/ts/modalComponent";
import ToastComponent from "qnect-sdk-web/lib/common/vue/ts/toastComponent";
import { Component, Prop, Vue } from "vue-facing-decorator";
import RolesEditViewInteractor from "../../core/ts/interactors/rolesEditViewInteractor";
import RolesEditViewPresenter from "../../core/ts/interactors/rolesEditViewPresenter";
import RolesEditViewModel from "../../core/ts/models/rolesEditViewModel";

@Component({
  name: "RolesEditViewComponent",
  components: {
    toast: ToastComponent,
    modal: ModalComponent,
  },
  template: `
    <div class="container home-page mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1 class="h3">{{ model.msgTitle }}</h1>
      <div v-show="model.msgNoAccess">
        <p>{{ model.msgNoAccess }}</p>
      </div>
      <template v-if="model.showMainContent">
        <form>
          <div class="mb-3">
            <label for="inputRoleName" class="form-label">{{ model.msgRoleName }}</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !!model.formErrors.roleAlias }"
              id="inputRoleName"
              v-model="model.role.alias"
            />
            <div class="invalid-feedback">{{ model.formErrors.roleAlias }}</div>
          </div>

          <fieldset class="mb-3">
            <legend class="col-form-label">{{ model.msgPermissions }}</legend>
            <div class="input-group mb-3">
              <span class="input-group-text" id="permission-filter">{{ model.msgFilter }}</span>
              <input
                type="text"
                class="form-control"
                :placeholder="model.msgShowAll"
                v-model="model.filter"
                @input="interactor.updateFilter(model.filter)"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                id="reset-permission-filter"
                @click="interactor.updateFilter('')"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div>
              <p>{{ model.msgNoPermissionsFound }}</p>
            </div>
            <div class="from-check form-switch mb-1" v-for="permission in model.role.permissions">
              <div v-show="permission.show">
                <input
                  class="form-check-input me-1"
                  type="checkbox"
                  role="switch"
                  v-model="permission.selected"
                  :id="'input' + permission.permissionId"
                />
                <label class="form-check-label" :for="'input' + permission.permissionId">{{ permission.alias }}</label>
              </div>
            </div>
          </fieldset>

          <div class="text-end mt-3">
            <button
              type="button"
              class="btn btn-outline-danger me-2"
              :disabled="model.disableActions"
              v-show="model.showDeleteAction"
              @click="() => interactor.requestDeleteRole()"
            >
              {{ model.msgDeleteAction }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="model.disableActions"
              @click="() => interactor.saveRole(model.role)"
            >
              {{ model.msgSaveAction }}
            </button>
          </div>
        </form>
      </template>

      <toast :show="model.showAddedSuccessful" color="success">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgAddedSuccessful }}</span>
      </toast>

      <toast :show="model.showSaveSuccessful" color="success">
        <i class="fa-solid fa-check me-1"></i>
        <span>{{ model.msgSaveSuccessful }}</span>
      </toast>

      <toast :show="model.showSaveFailed" color="danger">
        <i class="fa-solid fa-xmark me-1"></i>
        <span>{{ model.msgSaveFailed }}</span>
      </toast>

      <modal
        name="delete"
        :title="model.msgDeleteModalTitle"
        :show="model.showDeleteModal"
        :abortFunction="() => interactor.dismissDelete()"
      >
        <template v-slot:default>
          <p v-html="model.msgDeleteModalText"></p>
          <div class="alert alert-danger" role="alert" v-show="model.showDeleteFailed">
            {{ model.msgDeleteFailed }}
          </div>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-secondary" :disabled="model.disableActions" data-bs-dismiss="modal">
            {{ model.msgDeleteModalCancelAction }}
          </button>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="model.disableActions"
            @click="() => interactor.deleteRole()"
          >
            {{ model.msgDeleteModalDeleteAction }}
          </button>
        </template>
      </modal>
    </div>
  `,
})
export default class RolesEditViewComponent extends Vue implements RolesEditViewPresenter {
  @Prop
  private readonly interactor!: RolesEditViewInteractor;
  private model: RolesEditViewModel = new RolesEditViewModel();

  public mounted(): void {
    this.interactor.startPresenting(this);
  }

  public updateView(model: RolesEditViewModel): void {
    this.model = model;
  }
}
