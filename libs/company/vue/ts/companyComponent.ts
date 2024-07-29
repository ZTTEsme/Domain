import { Component, Prop, Vue } from "vue-facing-decorator";
import CompanyInteractor from "../../core/ts/interactors/companyInteractor";
import CompanyPresenter from "../../core/ts/interactors/companyPresenter";
import CompanyViewModel from "../../core/ts/models/companyViewModel";

@Component({
  name: "CompanyComponent",
  template: `
    <div class="container mt-3">
      <breadcrumb :items="model.breadcrumb" />
      <h1>{{ model.msgTitle }}</h1>

      <toast :show="model.showFilterErrorMessage" color="danger">
        <i class="fa-solid fa-triangle-exclamation"></i>
        {{ model.msgFilterErrorMessage }}
      </toast>

      <div class="row mb-5">
        <div class="col-12 col-sm-6 col-lg-5 col-xl-4">
          <label for="filter-agent-company" class="form-label">{{ model.msgFilterTitle }}</label>
          <select
            class="form-select"
            id="filter-agent-company"
            v-model="model.filterAgentId"
            @change="interactor.setCompanyFilter(model.filterAgentId)"
          >
            <option :value="undefined">{{ model.msgChooseAllFilter }}</option>
            <option v-for="company in model.unfilteredCompanies" :value="company.id">{{ company.alias }}</option>
          </select>
        </div>
      </div>

      <div v-show="model.showLoadingIndicator" class="text-center">
        <i class="fa-solid fa-circle-notch fa-spin fs-1"></i>
      </div>
      <div v-show="!model.showLoadingIndicator" class="row">
        <div class="col-12">
          <button type="button" class="btn btn-primary mb-3" @click="() => interactor.openCompanyDialog()">
            <i class="fa-solid fa-plus me-1"></i>{{ model.msgCreateCompanyAction }}
          </button>

          <ul class="table-list table-list--striped mb-0">
            <li class="table-list__row table-list__row--header">
              <div class="table-list__cell">{{ model.msgCompanyAlias }}</div>
              <div class="table-list__cell">{{ model.msgCompanyType }}</div>
              <div class="table-list__cell">{{ model.msgCompanyParent }}</div>
              <div class="table-list__cell">{{ model.msgCompanyAgent }}</div>
              <div class="table-list__cell">{{ model.msgCompanyCustomer }}</div>
              <div class="table-list__cell">{{ model.msgCompanyActions }}</div>
            </li>
            <li v-if="model.filteredCompanies.length === 0" class="table-list__caption">{{ model.msgNoCompanies }}</li>
            <li v-for="company in model.filteredCompanies" class="table-list__row">
              <div class="table-list__cell">{{ company.alias }}</div>
              <div class="table-list__cell">{{ company.type }}</div>
              <div class="table-list__cell">{{ company.parentCompanyName }}</div>
              <div class="table-list__cell">{{ company.agentCompanyName }}</div>
              <div class="table-list__cell">{{ company.customerId }}</div>
              <div class="table-list__cell">
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm me-1 mb-1"
                  @click="() => interactor.openCompanyDialog(company.id)"
                >
                  <i class="fa-regular fa-pen-to-square"></i>
                  {{ model.msgCompanyEditAction }}
                </button>

                <a class="btn btn-outline-primary btn-sm me-1 mb-1" :href="company.link">
                  <i class="fa-solid fa-right-to-bracket"></i>
                  {{ model.msgCompanyDetailsAction }}
                </a>

                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm mb-1"
                  @click="() => interactor.openDeleteDialog(company.id)"
                >
                  <i class="fa-regular fa-trash-can"></i>
                  {{ model.msgCompanyDeleteAction }}
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <modal
        name="edit-company"
        :show="model.showCompanyDialog"
        :title="model.msgCompanyDialog"
        :abortFunction="() => interactor.closeCompanyDialog()"
      >
        <alert :show="model.showSaveSuccessMessage" color="success" icon="fa-solid fa-check">
          {{ model.msgSaveSuccessMessage }}
        </alert>
        <alert :show="model.showSaveErrorMessage" color="danger" icon="fa-solid fa-triangle-exclamation">
          {{ model.msgSaveErrorMessage }}
        </alert>

        <form>
          <div class="mb-3">
            <label for="input-company-alias" class="form-label">{{ model.msgCompanyAlias }}</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid':!!model.formErrors.alias}"
              id="input-company-alias"
              v-model="model.companyInput.alias"
            />
            <div class="invalid-feedback" v-show="!!model.formErrors.alias">{{ model.formErrors.alias }}</div>
          </div>

          <div class="mb-3">
            <label for="input-company-type" class="form-label">{{ model.msgCompanyType }}</label>
            <select
              class="form-select"
              id="input-company-type"
              v-model="model.companyInput.type"
              :class="{'is-invalid':!!model.formErrors.type}"
            >
              <option value="CUSTOMER">{{ model.msgCompanyTypeCustomer }}</option>
              <option value="MANUFACTURER">{{ model.msgCompanyTypeManufacturer }}</option>
              <option value="TRADER">{{ model.msgCompanyTypeTrader }}</option>
              <option value="SUBSIDIARY">{{ model.msgCompanyTypeSubsidiary }}</option>
            </select>
            <div class="invalid-feedback" v-show="!!model.formErrors.type">{{ model.formErrors.type }}</div>
          </div>

          <div class="mb-3">
            <label for="input-company-parent" class="form-label">{{ model.msgCompanyParent }}</label>
            <select
              class="form-select"
              id="input-company-parent"
              v-model="model.companyInput.parentCompanyId"
              :class="{'is-invalid':!!model.formErrors.parentCompanyId}"
            >
              <option :value="null">-</option>
              <option v-for="company in model.unfilteredCompanies" :value="company.id">{{ company.alias }}</option>
            </select>
            <div class="invalid-feedback" v-show="!!model.formErrors.parentCompanyId">
              {{ model.formErrors.parentCompanyId }}
            </div>
          </div>

          <div class="mb-3">
            <label for="input-company-agent" class="form-label">{{ model.msgCompanyAgent }}</label>
            <select
              class="form-select"
              id="input-company-agent"
              v-model.number="model.companyInput.agentCompanyId"
              :class="{'is-invalid':!!model.formErrors.agentCompanyId}"
            >
              <option :value="null">-</option>
              <option v-for="company in model.unfilteredCompanies" :value="company.id">{{ company.alias }}</option>
            </select>
            <div class="invalid-feedback" v-show="!!model.formErrors.agentCompanyId">
              {{ model.formErrors.agentCompanyId }}
            </div>
          </div>

          <div class="mb-3">
            <label for="input-company-customer" class="form-label">{{ model.msgCompanyCustomer }}</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid':!!model.formErrors.customerId}"
              id="input-company-customer"
              v-model="model.companyInput.customerId"
            />
            <div class="invalid-feedback" v-show="!!model.formErrors.customerId">
              {{ model.formErrors.customerId }}
            </div>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              id="input-company-identity-provider"
              type="checkbox"
              v-model="model.companyInput.useExternalIdentityProviders"
              :disabled="model.disableExternalIdentityProvidersInput"
            />
            <label class="form-check-label" for="input-company-identity-provider">{{
              model.msgCompanyUsesExternalIdentityProviders
            }}</label>
          </div>
        </form>

        <template #footer>
          <button type="button" class="btn btn-primary" @click="() => interactor.saveCompany(model.companyInput)">
            {{ model.msgCompanySaveAction }}
          </button>
        </template>
      </modal>

      <modal
        name="delete-company"
        :show="model.showDeleteDialog"
        :title="model.msgDeleteCompany"
        :abortFunction="() => interactor.closeDeleteDialog()"
      >
        <alert :show="model.showDeleteSuccessMessage" color="success" icon="fa-solid fa-check">
          {{ model.msgDeleteSuccessMessage }}
        </alert>
        <alert :show="model.showDeleteErrorMessage" color="danger" icon="fa-solid fa-triangle-exclamation">
          {{ model.msgDeleteErrorMessage }}
        </alert>

        <p>{{ model.msgDeleteCompanyText }}</p>

        <template #footer>
          <button class="btn btn-danger" @click="() => interactor.deleteCompany()">
            {{ model.msgDeleteAction }}
          </button>
        </template>
      </modal>
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
